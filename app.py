from flask import Flask, render_template, Response
import cv2
import numpy as np
from tensorflow.keras.models import model_from_json  
from tensorflow.keras.preprocessing import image  
  

#load model  
model = model_from_json(open("fer.json", "r").read())  

#load weights  
model.load_weights('fer.h5')  


face_haar_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')  


app = Flask(__name__)

camera = cv2.VideoCapture(0)
faceDetectedStack = []
def gen_frames():  # generate frame by frame from camera
    while True:
        # Capture frame by frame
        success, frame = camera.read()
        if not success:
            break
        else:
            gray_img= cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  
        
            faces_detected = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)  
            entered = False

            for (x,y,w,h) in faces_detected:
                entered = True
                print('WORKING')
                cv2.rectangle(frame,(x,y),(x+w,y+h),(10, 207, 57),thickness=7)  
                roi_gray=gray_img[y:y+w,x:x+h]          #cropping region of interest i.e. face area from  image  
                roi_gray=cv2.resize(roi_gray,(48,48))  
                img_pixels = image.img_to_array(roi_gray)  
                img_pixels = np.expand_dims(img_pixels, axis = 0)  
                img_pixels /= 255  
        
                print(img_pixels.shape)
                
                predictions = model.predict(img_pixels)  
        
                #find max indexed array  
                
                max_index = np.argmax(predictions[0])  
        
                emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']  
                predicted_emotion = emotions[max_index]  
                print(predicted_emotion)
                cv2.putText(frame, predicted_emotion, (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 71, 17), 2)  
                cv2.putText(frame, 'JESUS FUCKING CHRIST', (int(x-20), int(y-20)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 71, 17), 3)
                  
            print(entered)
            faceDetectedStack.append(entered)
            #faceDetectedStack.pop()
            if len(faceDetectedStack) > 5: 
                 faceDetectedStack.pop()
            #for i in faceDetectedStack:
            print("STACK")
            print(faceDetectedStack) 

            if len(set(faceDetectedStack)) == 1:
                print("We should play music") 
            resized_img = cv2.resize(frame, (1000, 700))  
            
            ret, buffer = cv2.imencode('.jpg', frame)
            
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result


@app.route('/video_feed')
def video_feed():
    #Video streaming route. Put this in the src attribute of an img tag
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/emotion_response')
def emotion_response():
    emotion_embed='@ALLE DODI YOUR RESPONSE WILL GO HERE.'
    return render_template('index.html', embed=emotion_embed)


if __name__ == '__main__':
    app.run(debug=True)
