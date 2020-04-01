import cv2
import numpy as np
from PIL import Image
from utils import list_individual_images, break_captcha, save_tmp_name
import sys


READ_CAPTCHA_PATH = './src/images/'
PATH_EXISTENT = './src/images_individual/'
PATH_TMP = './src/images_tmp/'


def calculate_diff(img1, img2):
    matcher = cv2.xfeatures2d.SIFT_create(nfeatures=100)
    # surf = cv2.xfeatures2d.SURF_create()
    # matcher = cv2.ORB_create()
    # find the keypoints and descriptors with SIFT
    kp1, des1 = matcher.detectAndCompute(img1,None)
    kp2, des2 = matcher.detectAndCompute(img2,None)

    # BFMatcher with default params
    bf = cv2.BFMatcher()
    matches = bf.match(des1, des2)

    matches = sorted(matches, key=lambda val: val.distance)
    score = sum([i.distance for i in matches])
    return score


def compare_image(image1, image2):
    img1 = cv2.imread(image1, cv2.IMREAD_GRAYSCALE)
    img2 = cv2.imread(image2, cv2.IMREAD_GRAYSCALE)
    diff = calculate_diff(img1, img2)
    return diff


if __name__ == '__main__':
    try:
        target = sys.argv[1]
    except IndexError:
        print('You need to specify a target')
        print('python compare_images.py <icon-name>')
        sys.exit()

    image = Image.open('./src/images/'+target+'.png')
    matched_diff = sys.maxsize
    match = ''
    match_pos = None

    #break_captcha(PATH_TMP, target, image)
    for i, (captcha_name, captcha_image) in enumerate(break_captcha(READ_CAPTCHA_PATH, target, image)):
        for name, image in list_individual_images(PATH_EXISTENT):
            if target not in name:
                continue
            captcha_part = READ_CAPTCHA_PATH + captcha_name + '_' + str(i) + '.png'
            existent_image_path = PATH_EXISTENT + name
            diff = compare_image(existent_image_path, captcha_part)
            if diff < matched_diff:
                matched_diff = diff
                match = existent_image_path
                match_pos = i

    # print(matched_diff, match, match_pos)
    print(match_pos)
