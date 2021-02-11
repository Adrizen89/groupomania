<template>
    <v-app id="accueil">
        <top-header/>
        <router-view></router-view>
        <v-card-text id="caroussel"> 
            Bienvenue sur le Forum Officiel de Groupomania ! <br>
            Vous pourrez communiquer dans l'onglet "Forum". <br> <br>
            Règles à respecter : <br>
            - Etre courtois et respectueux. <br>
            - Modérer ses publications. <br><br>
            Si l'une de ces règles n'est pas respecter, vous serez sanctionnés ! <br>
            Modérateur : Adrien Bérard.
            </v-card-text>   

    </v-app>
</template>
<script>
import TopHeader from "./Accueil/TopHeader"
export default {
    name: "Accueil",
    components: {
        "top-header": TopHeader,
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
    #accueil{
        background: no-repeat center top/70% url("../assets/icon-left-font-monochrome-black.png") ;
        
    }
    
    #caroussel{
        font-size: 1.4em;
        text-align: center;
        margin: auto;
        @include tablet{
            font-size: 1em;
        }
        @include big-mobile{
            font-size: 0.7em;
        }
        @include mid-mobile{
            font-size: 0.5em;
        }
    }
    
        
    
</style>