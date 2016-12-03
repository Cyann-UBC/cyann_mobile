# Cyann ![icon](/screenshot/Icon-Small-40@2x.png?raw=true "Optional Title") 

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

If your computer isn't very fast the app might run before the project is completely built, in that case you will see a red screen, simply select the iPhone simulator and press command+R on your keyboard

<img src="/screenshot/Simulator Screen Shot Dec 2, 2016, 10.52.58 PM.png" width="200">

Once you see the login screen on your iPhone simulator, the app is all set :+1:

<img src="/screenshot/login.png" width="200">

After you tap the log in button and log yourself in with facebook, you will very likely see a blank screen with only a search bar, don't worry, it only means the mongoDB on your macbook isn't populated with any data.

If mongoDB contains course created by instructor, it would look like this

<img src="/screenshot/courseSearch.png" width="200">


##UI component breakdown 
Cyann is designed to provide the best user experience possible, but if by any chance you find the UI confusing, please visit [our wiki](https://github.com/Cyann-UBC/cyann_mobile/wiki)

##Please note
You may run into some issues, when you try to test the web ui on your local host. Your local database may not have any course
or posts created. It is because we limit the functionality of creating a course to instructor type of users. And we need email verification to change someone's user_type to instructor. One thing you can do is to use Robomongo, a database managing app, to change the content manually.
