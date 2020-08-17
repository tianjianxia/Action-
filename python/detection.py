# Random choose image ID
image_id = random.choice(dataset.image_ids1)
print(image_id)
image_id = 5311

# Custom string (Empty will choose from dataset itself)
s = "lion"

conf = np.zeros([1,1])

# Trasnfrom custom string to embedded vector
if s != "":
    start='<start>'
    end='<eos>'
    stnc = [start]
    txt = s.split(" ")
    stnc.extend(txt)
    stnc.extend([end])
    max_length = 18
    Li = np.zeros((1, max_length), dtype='uint32')
    tli = []

    for k, w in enumerate(stnc):
        if k < max_length:
            if w in dataset.vocab2idx:
                Li[0, k] = dataset.vocab2idx[w]
            else:
                Li[0, k] = dataset.vocab2idx["UNK"]
                
    print(stnc)
    print(Li)
    
# Get data based on image ID
image, image_meta, gt_class_id, gt_bbox, en_caption, bbox, captions, en_captions = modellib.load_image_gt(dataset, 
                                                                                    config, image_id, 
                                                                                    augmentation=None,
                                                                                    use_mini_mask=False)
print(gt_bbox)#randomly picked
print(bbox)
print(captions)

# Prepare data
tmpcap = captions[gt_class_id[0] - 1]
#class_id is an array, the reason why +1: we + 1 b4
#it might have more than 0ne element in case of we got many same object like in image 2063
print(gt_class_id[0]-1)# the index of corresponding 
print(gt_class_id)
print(tmpcap)
gt_class_id[gt_class_id > 0] = 1
info = dataset.image_info[image_id]
prev_caps = np.zeros((config.BATCH_SIZE, config.SEQ_LEN), dtype=int)
prev_caps[0, :len(en_caption)] = en_caption
print("Image ID: {}.{} ({}) {}".format(info["source"], info["id"], image_id,dataset.image_reference(image_id)))

if s != "":
    prev_caps = Li

# Choose one of the caption from dataset
target_caps = np.zeros((1, config.SEQ_LEN), dtype=int)
target_caps[0, :-1] = prev_caps[0, 1:] # exclude the <start>
print(target_caps)
sample_weight = np.zeros((1, config.SEQ_LEN), dtype=int)
sample_weight[target_caps > 0] = 1
print(sample_weight)
# Set confifence score
conf[0,0] = 0.05

# Run object detection
results = model.detect(prev_caps, sample_weight, conf, [image], verbose=0)
r = results[0]#list of dictiory roi: class_is: score:
print(results)

# Show only the top score based on dection results
if len(r['scores']) != 0:
    mxr = np.amax(r['scores'] * r['class_ids'])
    print(r['class_ids'])
    conf[0,0] = mxr - 0.01
    results = model.detect(prev_caps, sample_weight, conf, [image], verbose=0)
    r = results[0]

# Draw precision-recall curve
_, _, _, overlaps, pred_match, _ = utils.compute_ap(gt_bbox, gt_class_id, r['rois'], r['class_ids'], 
                                                    r['scores'], iou_threshold=0.9)

print("Caption: ", tmpcap)
print('Overlaps = {}'.format(overlaps))

# Display image and instances
print(gt_bbox)
print(gt_class_id)
visualize.display_instances(image, gt_bbox, gt_class_id, dataset.class_names)

# Display results
ax = get_ax(1)
visualize.display_instances(image, r['rois'], r['class_ids'], dataset.class_names, 
                            r['scores'], ax=ax, title="Predictions")