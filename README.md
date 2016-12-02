# cyann_mobile 
![icon](/screenshot/Icon-Small-40@2x.png?raw=true "Optional Title") 

##Intro
This is this repository for Cyann's mobile app power by [Cyann's backend](https://github.com/Cyann-UBC/Cyann)

Please follow the step in the backend to build and run the server on your localhost:8080

##How to build?
###due to the framework's complex nature:scream_cat: we have a lot to go over, this guide will walk you through the steps

First, follow [this](https://facebook.github.io/react-native/docs/getting-started.html) guild to setup react-native and npm on your computer.

After you've done that, do the following

###Facebook SDK
Because the mobile app uses Facebook SDK to handle user login, you will have to download Facebook SDK [here](Download the SDK)

On your computer, create a new folder called "FacebookSDK" under your ~/Documents

unzip the the Facebook SDK you just downloaded

and drag the following files to ~/Documents/FacebookSDK

this step is crucial, or the build will fail :broken_heart:
```
Bolts.framework
FBSDKCoreKit.framework
FBSDKLoginKit.framework
FBSDKShareKit.framework
```

![xcode](/screenshot/facebook.png?raw=true "Optional Title")

###NPM dependencies

then clone the repository
```
git clone https://github.com/Cyann-UBC/cyann_front
```

navigate to the folder
```
cd cyann_mobile
```

install dependencies
```
npm install
```

then start building the project
```
npm start
```

###Xcode
then
go to cyann_mobile/ios and double click on cyann_mobile.xcodeproj. Your Xcode will open up.

![xcode](/screenshot/xcode.png?raw=true "Optional Title")

Click the "play" button on the top-left corner and the app will start

![login](/screenshot/login.png?raw =50x)

If you see the login screen on your iPhone simulator, then you're all set :+1:
