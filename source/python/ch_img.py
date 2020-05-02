# Random choose image ID
image_id = random.choice(dataset.image_ids1)
# Custom string (Empty will choose from dataset itself)
s = ""
print(image_id)
conf = np.zeros([1,1])
# Get data based on image ID
image, image_meta, gt_class_id, gt_bbox, en_caption, bbox, captions, en_captions = modellib.load_image_gt(dataset, 
                                                                                    config, image_id, 
                                                                                    augmentation=None,
                                                                                    use_mini_mask=False)
# # Display image and instances
print(captions)
gt_class_id[gt_class_id > 0] = 1
visualize.display_instances(image, gt_bbox, gt_class_id, dataset.class_names)