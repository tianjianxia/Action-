import mute
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "1"
import sys
import random
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import utils as utils
import visualize
from visualize import display_images, display_images_c
import model as modellib
from model import *
from model import log
from train import *

# Other configurations are using from train.py file
# Check point of trained model
# os.environ["CUDA_VISIBLE_DEVICES"] = "1"
# MODEL_DIR = '/media/dataHD3/MAGnet/logs/'
MODEL_DIR = '/data/jiayang/logs/'
MODEL_PATH = '/data/jiayang/logs/magnet_flickr30k_0365.h5'
# MODEL_PATH = '/data/jiayang/logs/flickr30k20200320T2001/magnet_flickr30k_0020.h5'
#MODEL_PATH = '/data/jiayang/logs/mask_rcnn_flickr30k_0365.h5'
# Setup configurtion for testing
config = CustomConfig()
class InferenceConfig(config.__class__):
    IMAGES_PER_GPU = 1
config = InferenceConfig()
config.display()