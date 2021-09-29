import * as React from 'react'
import {Image,View,Button, Platform} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class PickImage extends React.Component{
    state={
        image:'null',
    }
    render(){
        let{Image}=this.state
        return(
            <View> 
             <Button color='green' title='Press Me' onPress={this.PickImage}/>
            </View>
        )
    }
    getPermissionsAsync = async () => {
        if(Platform.OS!=='web'){
            const{status}=await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if(status!=='granted'){
                alert('We Need Camera Roll Permission!');
            }
        }
    }
    uploadImage = async(uri) => {
        const data = new FormData()
        let filename = uri.split('/')[uri.split('/').lenght-1]
        let type = `image/${uri.split('.')[uri.split('.').lenght-1]}`
        const fileToUpload = {
            uri:uri,
            name:filename,
            type:type
        }
        data.append('Digit',fileToUpload)
        fetch("https://f292a3137990.ngrok.io/predict-digit",{
            method:'post',
            body:data,
            headers:{'content-type':'multipart/form-data'}
        })
        .then((Response) => Response.json())
        .then((result)=>{
            console.log('Succes:',result)
        }).catch((error)=>{
            console.error('Error:',error)
        })
    }
    pickImage = async() => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if (!result.cancelled){
                this.setState({
                    image:result.data
                })
                this.uploadImage(result.uri)
            }
        } catch(E){
            console.log(E)
        }
    }
}

