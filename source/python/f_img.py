find_img, find_imgshape, gt_class_id, gt_bbox, en_caption, bbox, captions, en_captions = modellib.load_image_gt(dataset_train, 
                                                                                config, 25472, 
                                                                                augmentation=None,
                                                                                use_mini_mask=False) 
#visualize.display_instances(find_img, gt_bbox,gt_class_id, dataset_train.class_names) 
print(captions)
print(gt_class_id)
print(gt_bbox)
print(dataset_train.class_names)
partial_gt_class_id = [1,1]
partial_gt_bbox = []
partial_gt_bbox.append(bbox[2])
partial_gt_bbox.append(bbox[5])
# partial_gt_bbox.append(bbox[9])
# partial_gt_bbox.append(bbox[10])
# partial_gt_bbox.append(bbox[13])

partial_gt_class_id = np.array(partial_gt_class_id)
partial_gt_bbox = np.array(partial_gt_bbox)
print(partial_gt_bbox)
visualize.display_instances(find_img, partial_gt_bbox, partial_gt_class_id, dataset_train.class_names)   