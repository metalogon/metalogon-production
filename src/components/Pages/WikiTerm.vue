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

            <div class="term__hero">

                <span class="term__search">
                    <input class="term__searchInput input" type="text" placeholder="Type your search terms here">
                    <button class="term__searchButton button">Search</button>
                </span>

            </div>

            <div class="term__body">

                <div class="term__headings">
                    <h1 class="term__heading">Term 1</h1>
                    <p class="term__description">noun | pronounciation</p>
                </div>

                <div class="term__definition">
                    <h3 class="definition__title">Definition</h3>
                    <p class="definition__content">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
                </div>

                <div class="term__X">
                    <div class="term__examples">

                        <h3 class="examples__heading">Examples</h3>

                        <div class="example">
                            <img src="../../assets/black-img.png" class="example__image">
                            <div class="example__metadata">
                                <span class="example__title">Video name | 02:31-03:05</span> 
                                <p class="example__content">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            </div> 
                        </div>

                        <div class="example">
                            <img src="../../assets/black-img.png" class="example__image">
                            <div class="example__metadata">
                                <span class="example__title">Video name | 02:31-03:05</span> 
                                <p class="example__content">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            </div> 
                        </div>

                    </div>

                    <div class="term__related">
                        <h3 class="related__heading">Related Terms</h3>
                        <div class="related__menu">
                            <a class="related__menuItem">Term 2</a>
                            <a class="related__menuItem">Term 3</a>
                            <a class="related__menuItem">Term 4</a>
                            <a class="related__menuItem">Term 5</a>
                        </div>
                    </div>
                </div>

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
                #TERM-HERO
================================================= */

    .term__hero {
        background: url('../../assets/wiki-background.jpg') center ; 
        background-size: 80%;      
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }


        .term__search {
            color: white;
            font-size: 28px;
        }

            .term__searchInput {
                width: 550px;
                height: 40px;
                border: 1px solid black;
                padding-left: 10px;
                font-size: 12px;
                font-style: italic;
            }

            .term__searchButton {
                color: white;
                height: 40px;
                padding: 0 20px;
                background-color: #AF0931;
                border: 1px solid black;
                font-size: 12px;
            }

            .term__searchButton:hover {
                border: none;
            }


/* ==============================================
                #TERM-HEADING
================================================= */

    .term__body {
        display: flex;
        flex-direction: column;
        padding: 30px 225px;      
    }

        .term__headings {
            text-align: center;
            padding: 15px 0px;
            border-bottom: 2px solid #eee;
        }
            .term__heading {
                font-size: 32px;
                font-weight: 600;
                color: #1d1f1e;
            }

            .term__description {
                margin-top: 15px;
                color: gray;
            }



/* ==============================================
                #TERM-DEFINITION
================================================= */

        .term__definition {
            padding: 20px 0px;
            border-bottom: 2px solid #eee;
        }
            .definition__title {
                font-size: 20px;
                font-weight: 600;
                color: #1d1f1e;
                margin-bottom: 5px;
            }

            .definition__content {
                color: gray;
            }


/* ==============================================
                #TERM-EXAMPLES
================================================= */

        .term__X {
            padding: 20px 0px;
            display: flex;
            justify-content: space-between;
        }

            .term__examples {
                width: 70%;
            }

                .examples__heading {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1d1f1e;
                    margin-bottom: 5px;
                }

                .example {
                    margin-top: 15px;
                    display: flex;
                }
                    .example__image {
                        margin-right: 20px;
                    }

                    .example__metadata {

                    }

                        .example__title {
                            color: #1d1f1e;
                            font-weight: 500;
                        }

                        .example__content {
                            color: gray;
                        }


/* ==============================================
                #TERM-RELATED
================================================= */

            .term__related {
            }

                .related__heading {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1d1f1e;
                    margin-bottom: 10px;
                }

                .related__menu {
                    display: flex;
                    flex-direction: column;
                }

                    .related__menuItem {
                        color: gray;
                        margin: 8px 0px;
                    }


</style>