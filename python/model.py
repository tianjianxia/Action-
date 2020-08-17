embed_mat = dataset.get_embmat()
model = modellib.MAGnet(mode="inference", model_dir=MODEL_DIR, embed_mat=embed_mat, config=config)

print("Loading weights ", MODEL_PATH)
model.load_weights(MODEL_PATH, by_name=True)