<template>
    <v-app id="forum" class="forum">

        <top-header/>
        <div class="ml-12">
            <h1 class="ma-4" style="color:black">Forum</h1>
            

            <router-view></router-view>
            <v-container >
                <!-- Bouton pour créer un post -->
                <v-btn class="btn-createPost ma-3"  @click="afficheForm">Créer un post</v-btn>
                
                <!-- Les posts -->
                <v-card class="forum__post ma-3 mt-6" v-for="(post, index) in allPosts" v-bind:key="index">
                    <div class="d-flex justify-space-between">
                        <v-card-title>
                            <h2 class="forum__post__title ml-0">{{ post.title }}</h2>
                        </v-card-title>
                        <v-card-actions class=" forum__post__manage" v-if="post.userId = userId">
                            <v-btn class="btn-modify forum__post__manage--btn" color="black" title="modifier le post" @click.stop="goDialogUpPost(post.title, post.content, post.id, post.imgUrl)" icon>
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn class="btn-delete forum__post__manage--btn" color="black" title="supprimer le post" @click="deletePost(post.id)" icon>
                                <v-icon>mdi-delete</v-icon>
                            </v-btn> 
                        </v-card-actions>

                    </div>
                    <!-- Le post -->
                    <v-card-subtitle class="forum__post__name">
                        Par {{ post.firstName }} {{ post.lastName }}, le {{ post.date }} à {{ post.time }}
                    </v-card-subtitle>


                    <v-card-text class="v-card-text black--text forum__post__content" >
                        {{ post.content }}
                        
                    </v-card-text>
                    <v-img class="img-post" :src="post.imgUrl" v-if="post.imgUrl !== ''">
                    </v-img>

                    <!-- Voir les commentaires -->
                    <v-card-text class="py-0">   
                        <v-btn class="btn-seeCom" text @click="afficheCom(post.id)" title="Voir les commentaires">
                            <v-icon>mdi-comment-eye</v-icon>
                            Voir les commentaires 
                        </v-btn>
                    </v-card-text>

                    <!-- Fenêtre modifier le post -->
                    <v-dialog v-model="dialogUpPost" max-width="500px">
                        <v-card>
                            <v-card-title>Modifier mon post</v-card-title>
                            <v-card-text>
                                <v-form ref="form" v-model="valid">
                                    <v-text-field v-model="dataPost.title" color="black" :rules="titleRules" :counter="50" label="Titre"></v-text-field>
                                    <v-textarea v-model="dataPost.content" color="black" :rules="contentRules" label="Commentaire"></v-textarea>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn text @click="dialogUpPost=false">Annuler</v-btn>
                                <v-btn text :disabled="!valid" @click="updatePost()">Valider</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- Les commentaires -->
                    <div class="forum__comments" v-if="postId === post.id">
                        <v-card class="forum__comments--ind my-1 mx-2 pa-3 " color="#ECECEC" v-for="(comment, index) in allComments" v-bind:key="index" outlined>
                            <v-card-subtitle class="pa-0 forum__comments__name">
                                Le {{ comment.date }}, {{ comment.firstName }} {{ comment.lastName }} commente :
                            </v-card-subtitle>
                            
                            <v-card-text class="pa-0 text--primary forum__comments__content ">
                                {{ comment.comContent }}
                            </v-card-text>
                            <v-btn class="deleteCom" title="Supprimer le commentaire" @click="deleteCom(comment.id)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                            
                        
                        </v-card>
                        <v-btn v-if="!afficheFrmCm" color="black white--text" title="commenter le post" class="ma-2 btn-commenter" @click="afficheFormCom()">Commenter</v-btn>
                        <v-card v-if="afficheFrmCm">
                            <v-form  ref="form" class="ma-3" v-model="valid" v-if="form">
                                <v-textarea background-color="#ECECEC" color="black" v-model="dataCom.comContent" :rules="comContentRules" :counter="255" label="Commentaire" autofocus required></v-textarea>
                            </v-form>
                            <v-btn :disabled="!valid" class="success ma-2" @click="sendCom(post.id)">Poster</v-btn>
                            
                        </v-card>
                    </div>
                </v-card>
            </v-container>
        </div>
    </v-app>
</template>

<script>
import TopHeader from "./TopHeader"
import axios from "axios"

export default {
    name: "forum",
    data(){
        return{
            userId: "",
            admin: "",
            afficheFrmCm: false,
            allPosts: [],
            allComments: [],
            postId: "",
            dialogUpCom: false,
            dialogUpPost: false,
            valid: true,
            titleRules: [
                v => !!v || 'Titre de la publication',
                v => (v && v.length <= 50) || 'Le titre doit faire moins de 50 caractères',
            ],
            contentRules: [
                v => !!v || 'Ecrivez votre message',
            ],
            comContentRules: [
                v => !!v || 'Ecrivez votre commentaire',
                v => (v && v.length <= 255) || 'Le commentaire doit faire moins de 255 caractères',
            ],
            dataPost: {
                id: "",
                title:"",
                content:"",
                imgUrl:"",
                userId:"",
            },
            dataPostS: "",
            dataCom:{
                id: "",
                comContent:"",
                userId: ""
            },
            dataComS: "",
            form: true,

            postDetails: this.post
            
            
        }
    },
    methods: {
        afficheCom(pId){
            this.postId = pId;
            this.afficheFrmCm = false;
            axios.get("http://localhost:3000/api/posts/" + pId + "/comments", {headers: {Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let com = JSON.parse(response.data);
                    this.allComments = com;
                })
                .catch(error => {
                console.log(error);
                });
        },
        sendCom(pId){
            this.dataCom.userId = this.userId;
            this.dataComS = JSON.stringify(this.dataCom);
            axios.post("http://localhost:3000/api/posts/" + pId + "/comments", this.dataComS, {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    this.dataCom.comContent="";
                    this.dataCom.userId="";
                    this.afficheFrmCm=false;
                })
                .catch(error => {
                    console.log(error); 
                    this.message=error;
                    this.msg=true
                });
        },
        deletePost(pId){
            axios.delete("http://localhost:3000/api/posts/" + pId, {headers: {Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    window.location.assign('http://localhost:8080/Accueil/forum');
                })
                .catch(error => {
                    console.log(error);    
                })
        },
        deleteCom(cId){
            axios.delete("http://localhost:3000/api/posts/comments/" + cId, {headers: {Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    window.location.assign('http://localhost:8080/Accueil/forum');
                })
                .catch(error => {
                    console.log(error);
                })
        },
        goDialogUpPost(postTitle, postContent, postId, postImgUrl){
            this.dataPost.title = postTitle;
            this.dataPost.content = postContent;
            this.dataPost.id = postId;
            this.dataPost.imgUrl = postImgUrl;
            this.dialogUpPost = true;
        },
        updatePost(){
            this.dataPost.userId = localStorage.userId;
            this.dataPostS = JSON.stringify(this.dataPost);
            axios.put("http://localhost:3000/api/posts/" + this.dataPost.id, this.dataPostS, {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    this.dataPost.title = "";
                    this.dataPost.content = "";
                    this.dataPost.imgUrl = "";
                    this.dataPost.userId = "";
                    this.dataPost.id = "";
                    this.dialogUpPost = false;
                    window.location.assign('/Accueil/forum');
                })
                .catch(error => {
                    console.log(error);
                })
        },
        goDialogUpCom(comContent, comId){
            this.dataCom.id = comId;
            this.dataCom.comContent = comContent;
            this.dialogUpCom = true; 
        },
        updateCom(){
            this.dataCom.userId = localStorage.userId;
            this.dataComS = JSON.stringify(this.dataComS);
            axios.put("http://localhost:3000/api/posts/comments/" + this.dataCom.id, this.dataComS, {headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.token}})
                .then(response => {
                    let rep = JSON.parse(response.data);
                    console.log(rep.message);
                    this.dataCom.comContent = "";
                    this.dataCom.userId = "";
                    this.afficheFrmCm = false;
                    this.dialogUpCom = false;
                    window.location.assign('http://localhost:8080/Accueil/forum');
                })
                .catch(error => {
                    console.log(error);
                    
                })
        },
        afficheForm(){
            this.$router.push('/Accueil/forum/Post')
        },
        afficheFormCom(){
            this.afficheFrmCm = true
        },
    },
    components: {
        "top-header": TopHeader, 
    },
    mounted(){
        this.userId = localStorage.userId;
        axios.get("http://localhost:3000/api/posts", {headers: {Authorization: 'Bearer ' + localStorage.token}})
            .then(response => {

                let posts = JSON.parse(response.data);
                this.allPosts = posts;
            })
            .catch(error => {
            console.log(error); 
            });
        
    },
}
</script>
<style lang="scss">
@mixin tablet{
        @media screen and (max-width : 790px) {
            @content;
        }
    }
@mixin big-mobile{
        @media screen and (max-width : 580px) {
            @content;
        }
    }
@mixin mid-mobile{
        @media screen and (max-width : 425px) {
            @content;
        }
    }
    h1{
        text-align: center;
        color: #154360;
    }
    .img-post{
            width: 40%;
            margin: auto;
        }
    .d-flex{
        @include tablet{
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
        }
    }
    .forum{
        &__comments{
            &--ind{
                position: relative;
            }
        }
        .v-card-text{
            @include tablet{
                font-size: 0.7em;
            }
        }
        .forum__post__title{
            @include tablet{
                font-size: 1em;
            }
            @include big-mobile{
                font-size: 0.8em;
                text-align: center;
            }
        }
        .btn-createPost{
            @include tablet{
                font-size: 0.8em;
            }
            @include big-mobile{
                font-size: 0.6em;
            }
        }
        
        .v-card__actions{
            @include tablet{
                width: 20%;
                padding: 0;
            }
            @include big-mobile{
                justify-content: center;
            }
        }
        .v-btn{
        @include tablet{
            font-size: 0.8em;
        }
        @include big-mobile{
            font-size: 0.6em;
        }

    }
   }
</style>

