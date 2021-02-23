<template>
    <v-app id="formPost">
        <top-header/>
        <h1 class="ml-12">Forum</h1>
        <v-card class="ma-3 ml-12">
            <v-card-title class="mb-3">
                <h2>Nouveau post</h2>
            </v-card-title>
            
            <v-card-text>
                <v-form @submit.prevent="sendPost" id="form" ref="form" class="ma-3" v-model="valid" >
                    <v-text-field v-model="dataPost.title" color="black" :rules="titleRules" :counter="50" label="Titre" autofocus required></v-text-field>
                    <v-textarea v-model="dataPost.content" color="black" :rules="contentRules" label="Message" required></v-textarea>
                    <v-file-input name="file" accept="image/png, image/jpeg, image/jpg" hide-input prepend-icon="mdi-image-plus" v-model="image" > </v-file-input>

                </v-form>
            </v-card-text>
            

            <v-card-actions>
                
                <v-btn form="form" :disabled="!valid" type="submit" class="success" >Poster</v-btn>
                <v-btn text href="/Accueil/Forum" color="black">Annuler</v-btn>
            </v-card-actions>
            

        </v-card>
    </v-app>
</template>
<script>
import axios from "axios"
import TopHeader from "./TopHeader"


export default {
    name: "FormPost",
    data(){
        return{
            valid: true,
            //Condition pour le titre
            titleRules: [
                v => !!v || 'Titre de la publication',
                v => (v && v.length <= 50) || 'Le titre doit faire moins de 50 caractères',

            ],
            //Condition pour le texte
            contentRules: [
                v => !!v || 'Ecrivez votre message',
            ],
            dataPost:{
                title: "",
                content:"",
                userId: localStorage.userId
            },
            dataPostS: "",
            msg: false,
            message: "",
            image: undefined,
            imgUrl: ""
        }
    },
    methods: {
        //Insert d'image
        imageInput(){
            this.file = this.$refs.file.files[0];
            this.img = URL.createObjectURL(this.file);
        },
        //Envoyer et poster le post
        sendPost(evt){
            let body = new FormData();
            body.append("file", evt.target[3].files[0]);
            body.append("title", this.dataPost.title);
            body.append("content", this.dataPost.content);
            body.append("userId", this.dataPost.userId);
            this.dataPostS = JSON.stringify(this.dataPost);

            axios.post("http://localhost:3000/api/posts/", 
            body, 
            {headers: 
            {'Content-Type': 'application/json', 
            Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = response.data;
                    this.message = rep.message;
                    this.msg = true;
                    this.form = false;
                    this.$router.push('/Accueil/Forum');
                    if (this.image != undefined) {
                        body.append("file", this.image);
                    }
                    },
                    
                )
                .catch(error => {
                    console.log(error); 
                    this.message = error;
                    this.msg = true
                });
        },
    },
    components: {
        "top-header": TopHeader, 
        
    },
}
</script>
<style lang="scss">

    .img {
        &--inside {
            width: 15%;
            height: auto;
        }
    }
</style>