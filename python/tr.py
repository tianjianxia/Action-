dataset_train = CustomDataset()
dataset_train.load_data(config,'train')
query = "lion"
print("checking from dataset: train...")
match_set = []#to store the id for images that have such caption
partial_match_set = {}# to store id for images that have some of the attibutes

for i in tqdm(range(len(dataset_train.image_ids1))):
    current_imgid = dataset_train.image_ids1[i]
    captions = dataset_train.imgs[current_imgid]['captions']
    caption_ids = []

    for j in range(len(captions)): #the len of caption and len of final_captions is the same
        if query == captions[j]:#means it's been seen b4
            caption_ids.append(j)
    if len(caption_ids) != 0:
        temp = [current_imgid, caption_ids]
        match_set.append(temp)
            
if(len(match_set) == 0):
    stnc1 = []
    txt = query.split(" ")
    stnc1.extend(txt)
    for i in range(len(stnc1)):
        partial_match_set[stnc1[i]] = []
    print(stnc1)
    for i in tqdm(range(len(dataset_train.image_ids1))):
        #go to see if partial of its attributes has been seen b4
        current_imgid = dataset_train.image_ids1[i]
        final_captions = dataset_train.imgs[current_imgid]['final_captions']
        for n in range(len(stnc1)):
            caption_ids = []
#             if stnc1[n] == 'a' or 'the' or 'an' or 'of':
#                 continue
            for k in range(len(final_captions)):
                if stnc1[n] in final_captions[k]:
                    
                    caption_ids.append(k)
            if len(caption_ids) != 0:
                temp = [current_imgid,caption_ids]
                partial_match_set[stnc1[n]].append(temp)
            
                    
print(match_set)
print(partial_match_set)