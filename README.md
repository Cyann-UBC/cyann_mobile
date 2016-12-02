# cyann_mobile 
![icon](/screenshot/Icon-Small-40@2x.png?raw=true "Optional Title") 

##Intro
Cyann's mobile app, powered by [Cyann's backend](https://github.com/Cyann-UBC/Cyann)

Please follow the steps in the backend to build and run the server on your localhost:8080

##How to build?
####Due to the framework's complex nature:scream_cat: we have a lot to go over, this guide will walk you through the steps
####React Native can be quite picky about its environment. If by any chance you're unable to set up the project on your computer, email me at howard7zhou@alumni.ubc.ca. I will come help you build the project.

First you will need a MAC laptop.

Then, follow [this](https://facebook.github.io/react-native/docs/getting-started.html) guild to setup react-native and npm on your computer.

After you've done that, do the following

###Facebook SDK
Because the mobile app uses iOS Facebook SDK to handle user login, you will have to download Facebook SDK [here](https://origincache.facebook.com/developers/resources/?id=facebook-ios-sdk-current.zip)

On your computer, create a new folder called "FacebookSDK" under your ~/Documents

unzip the the Facebook SDK you just downloaded

and drag the following files to ~/Documents/FacebookSDK

this step is crucial, skip it and the build fails :broken_heart:
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
git clone https://github.com/Cyann-UBC/cyann_mobile
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

<img src="/screenshot/login.png" width="200">

Once you see the login screen on your iPhone simulator, then you're all set :+1:

