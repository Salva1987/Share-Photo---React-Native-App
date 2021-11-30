import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import logoBombillo from './assets/logoBombillo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import * as SplashScreen from 'expo-splash-screen';
import { set } from 'react-native-reanimated';

export default function App() {

  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePicker = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if(pickerResult.cancelled == true){
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri});
    } else {
      setSelectedImage({localUri: pickerResult.uri, remoteUri: null});
    }

  };

  let openShareDialogAsync = async () => {
    if ( !( await Sharing.isAvailableAsync() ) ) {
      alert(`Image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  };

  if (selectedImage !== null){
    return (
    <View style={styles.container}>
      <Image source={{uri: selectedImage.localUri}} style={styles.thumbnail} />
      <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
        <Text style={styles.buttonText}>Share this photo</Text>
      </TouchableOpacity>
    </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Image source={logo} style={styles.logo} />
      {/* <Image source={{ uri: 'https://www.nicepng.com/png/detail/141-1415512_mfc-cat-logo-contrast-animal-welfare-drawing.png' }} style={{ width: 305, height: 159 }} /> */}

      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button below!
      </Text>

      <TouchableOpacity onPress={openImagePicker} style={styles.button}>
        <Text style={styles.buttonText}>
          Pick a photo
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBombillo: {
    width: 305, 
    height: 220,
  },
  instructions: {
    color: 8888,
    fontSize: 18
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  }, 
  buttonText: {
    fontSize: 20,
    color: '#ffff',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
