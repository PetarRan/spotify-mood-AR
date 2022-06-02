import cv2
import numpy as np
from tensorflow.keras.models import model_from_json  
from tensorflow.keras.preprocessing import image  
  

#load model  
model = model_from_json(open("fer.json", "r").read())  

#load weights  
model.load_weights('fer.h5')  


face_haar_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')  
  
  
cap=cv2.VideoCapture(0)  
  
while True:  
    ret,test_img=cap.read()# captures frame and returns boolean value and captured image  
    if not ret:  
        continue  
    gray_img= cv2.cvtColor(test_img, cv2.COLOR_BGR2GRAY)  
  
    faces_detected = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)  
    
  
    for (x,y,w,h) in faces_detected:
        print('WORKING')
        cv2.rectangle(test_img,(x,y),(x+w,y+h),(59, 152, 81),thickness=7)  
        roi_gray=gray_img[y:y+w,x:x+h]#cropping region of interest i.e. face area from  image  
        roi_gray=cv2.resize(roi_gray,(48,48))  
        img_pixels = image.img_to_array(roi_gray)  
        img_pixels = np.expand_dims(img_pixels, axis = 0)  
        img_pixels /= 255  
  
        predictions = model.predict(img_pixels)  
  
        #find max indexed array  
        max_index = np.argmax(predictions[0])  
  
        emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']  
        predicted_emotion = emotions[max_index]  
        print(predicted_emotion)
        cv2.putText(test_img, predicted_emotion, (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)  
        
    s_img = cv2.imread("https://upload.wikimedia.org/wikipedia/commons/c/c0/Jesus_Christ_-_Hofmann.jpg")
    resized_img = cv2.resize(test_img, (1000, 700))  
    #x_offset=y_offset=50
    #resized_img[y_offset:y_offset+s_img.shape[0], x_offset:x_offset+s_img.shape[1]] = s_img
    
    cv2.imshow('Facial emotion analysis ',resized_img)  

  
  
  
    if cv2.waitKey(10) == ord('q'):#wait until 'q' key is pressed  
        break  
  
cap.release()  
cv2.destroyAllWindows 
