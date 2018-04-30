<template>
    <div class="wiki">
            
        <my-header></my-header>

        <div class="wiki__body">

            <div class="wiki__subhead">

                <div class="wiki__subheadMenu">
                    <a class="wiki__subheadLink">HOW IT WORKS</a>
                    <a class="wiki__subheadLink">BROWSE TERMS</a>
                    <a class="wiki__subheadLink">FORUM <i class="fa fa-caret-down"></i></a>
                    <button class="wiki__subheadLink wiki__subheadButton">Post a Term</button>
                </div>

            </div>

            <div class="wiki__hero">

                <h1 class="wiki__heroTitle">LOOK IT UP</h1>

                <span class="wiki__heroDescription">If you don't know what a term means just look it up below.</span>

                <span class="wiki__search">
                    <input class="wiki__searchInput input" type="text" placeholder="Type your search terms here">
                    <button class="wiki__searchButton button">Search</button>
                </span>

            </div>

            <div class="wiki__content">
                <el-tabs class="wiki__tabs">
                    <el-tab-pane label="Recent Terms">
                        <router-link to="/wiki-term" tag="div" class="term">
                            <img src="../../assets/black-img.png" class="term__img">
                            <div class="term__metadata">
                                <span class="term__head">
                                    <h3 class="term__title">Term 1</h3>
                                </span>
                                <span class="term__content">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</span>
                                <span class="term__tags">

                                </span>
                            </div>
                        </router-link>
                        <router-link to="/wiki-term" tag="div" class="term">
                            <img src="../../assets/black-img.png" class="term__img">
                            <div class="term__metadata">
                                <span class="term__head">
                                    <h3 class="term__title">Term 2</h3>
                                </span>
                                <span class="term__content">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. </span>
                                <span class="term__tags">

                                </span>
                            </div>
                        </router-link>
                    </el-tab-pane>
                    
                    <el-tab-pane label="Popular Terms">
                        Popular Terms
                    </el-tab-pane>

                    <el-tab-pane label="Question Forum">
                        Question Forum
                    </el-tab-pane>
                </el-tabs>
            </div>

        </div>

        <my-footer></my-footer> 

    </div>
</template>

<script>
    import MyHeader from '../Layout/MyHeader.vue'
    import MyFooter from '../Layout/MyFooter.vue'
    
    export default {
        components: {
            'my-header': MyHeader,
            'my-footer': MyFooter,
        }
    }
</script>

<style>

.wiki__body {
    
}

/* ==============================================
                    #WIKI-SUBMENU
================================================= */

    .wiki__subhead {
        height: 52px;
    }

        .wiki__subheadMenu {
            height: 100%;
            padding: 0 150px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
            .wiki__subheadLink {
                color: black;
                padding: 0 20px;
            }

            .wiki__subheadButton {
                color: white;
                background-color: black;
                padding: 10px 30px;
                border: none;
                font-weight: 500;
            }



/* ==============================================
                    #WIKI-HERO
================================================= */

    .wiki__hero {
        background: url('../../assets/wiki-background.jpg'); 
        background-size: 90%;      
        height: 250px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

        .wiki__heroTitle {
            color: white;
            font-size: 58px;
            margin-bottom: 10px;
        }

        .wiki__heroDescription {
            color: white;
            font-size: 18px;
            margin-top: 20px;
        }

        .wiki__search {
            color: white;
            font-size: 28px;
            margin-top: 20px;
        }

            .wiki__searchInput {
                width: 550px;
                height: 40px;
                border: 1px solid black;
                padding-left: 10px;
                font-size: 12px;
                font-style: italic;
            }

            .wiki__searchButton {
                color: white;
                height: 40px;
                padding: 0 20px;
                background-color: #AF0931;
                border: 1px solid black;
                font-size: 12px;
            }

            .wiki__searchButton:hover {
                border: none;
            }



/* ==============================================
                    #WIKI-TABS
================================================= */

    .wiki__content {
        margin-bottom: 80px;
        height: 300px;
        display: flex;
        justify-content: center;
    }

        .wiki__tabs {
            width: 60%;
        }

        .wiki__tabs .el-tabs__nav {
        }

            .wiki__tabs .el-tabs__active-bar {
                background-color: #AF0931;
            }

            .wiki__tabs .el-tabs__item {
                width: 220px;
                text-align: center;
                font-size: 16px;
                margin-top: 12px;
                margin-bottom: 12px;
                margin-left: 30px;
            }
            
            .wiki__tabs .el-tabs__item.is-active{
                color: #1d1f1e;
            }



/* ==============================================
                    #WIKI-TERM
================================================= */

            .term {
                display: flex;
                justify-content: center;
                padding-top: 20px;
                padding-bottom: 20px;
                cursor: pointer;
            }

                .term__img {
                    margin-right: 20px;
                }

                .term__metadata {

                }

                    .term__head {

                    }
                        .term__title {
                            font-size: 18px;
                            font-weight: 700;
                        }

                    .term__content {

                    }

                    .term__tags {

                    }


</style>