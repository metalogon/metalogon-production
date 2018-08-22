<template>
    <div class="wiki">
            
        <my-header></my-header>

        <div class="wiki__body">

            <wiki-subhead></wiki-subhead>

            <div class="term__hero">

                <!-- <span class="term__search">
                    <input class="term__searchInput input" type="text" placeholder="Type your search terms here">
                    <button class="term__searchButton button">Search</button>
                </span> -->

            </div>

            <div class="term__body">

                <nav class="breadcrumb term__breadcrumb">
                    <ul>
                        <li><a @click="goWiki()">{{ currentTerm.canon }}</a></li>
                        <li class="is-active"><a href="#" aria-current="page">{{ currentTerm.name }}</a></li>
                    </ul>
                </nav>

                <div class="term__headings">
                    <h1 class="term__heading">{{ currentTerm.name }}</h1>
                    <p class="term__description">noun | pronounciation</p>
                </div>

                <div class="term__rowtext">
                    <h3 class="rowtext-title">Definition</h3>
                    <div class="rowtext-content" @click="definitionIsOpen = true" v-if="!definitionIsOpen">{{ currentTerm.description }}</div>
                    <textarea class="textarea" v-model="currentTerm.description" @blur="saveEdit(currentTerm.id, 'description')" type="text" v-if="definitionIsOpen"></textarea>
                </div>

                <div class="term__rowtext">
                    <h3 class="rowtext-title">Description</h3>
                    <div class="rowtext-content" @click="descriptionIsOpen = true" v-if="!descriptionIsOpen">{{ currentTerm.description }}</div>
                    <textarea class="textarea" v-model="currentTerm.description" @blur="saveEdit(currentTerm.id, 'description')" type="text" v-if="descriptionIsOpen"></textarea>
                </div>

                <div class="term__largerow">
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
                            <a class="related__menuItem" v-for="rt in relatedTerms" :key="rt">{{ rt }}</a>
                            <a class="related__menuItem related__addNew" v-if="!relatedInputIsOpen" @click="openRelatedSearch()"><i class="fa fa-plus"></i> Add new</a>
                            <el-autocomplete class="inline-input related__input" v-if="relatedInputIsOpen" v-model="searchInputRelated" :fetch-suggestions="querySearch" @select="handleSelect"></el-autocomplete>
                            <div class="related__actions">
                                <span class="related__close" @click="relatedInputIsOpen = false" v-if="relatedInputIsOpen"><i class="fa fa-times" aria-hidden="true"></i></span>
                                <span class="related__save" @click="saveRelatedTerm()" v-if="relatedInputIsOpen">Save</span>
                            </div>
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
    import WikiSubhead from '../Pages/WikiSubhead.vue'
    import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
    
    export default {
        data() {
            return {
                currentTerm: {},
                definitionIsOpen: false,
                descriptionIsOpen: false,
                relatedTerms: [ 'Metadiscourse', 'Posture and stance', 'Language'],
                searchInputRelated: '',
                relatedInputIsOpen: false,
                terms: [],
                newTerm: { termId: '', value: '' } 
            }
        },
        created() {
            for (var i = 0; i < this.categories.length; i++) {
                if ( this.categories[i].id === this.$route.params.id) {
                    this.currentTerm = this.categories[i]
                }
            }
        },
        mounted() {
            this.terms = this.loadAll();
        },
        methods: {
            saveEdit(categoryId, field) {
                this.$store.dispatch('editCategory', { 
                    id: categoryId, 
                    categoryBody: { [field]: this.currentTerm[field] } 
                })

                if (field === 'description') {
                    this.descriptionIsOpen = false
                    this.definitionIsOpen = false
                }
                // else 
            },
            goWiki() {
                this.$store.commit('SELECT_CURRENT_WIKI_CANON', this.currentTerm.canon)
                this.$router.push('/wiki')
            },
            openRelatedSearch() {
                this.relatedInputIsOpen = true
                this.searchInputRelated = ''
            },
            querySearch(queryString, cb) {
                var terms = this.terms;
                var results = queryString ? terms.filter(this.createFilter(queryString)) : terms;
                // call callback function to return suggestions
                cb(results);
            },
            createFilter(queryString) {
                return (term) => {
                    return (term.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            loadAll() {
                var allTerms = []
                for (var i = 0; i < this.categories.length; i++) {
                    allTerms.push({ value: this.categories[i].name, termId: this.categories[i].id })
                }
                return allTerms
            },
            handleSelect(term) {
                console.log(term);
                this.newTerm.termId = term.termId
                this.newTerm.value = term.value
            },
            saveRelatedTerm() {
                this.relatedTerms.push(this.newTerm.value)
                this.relatedInputIsOpen = false
            }
        },
        computed: {
			...mapGetters(
				[ 'categories' ]
			)
		},
        components: {
            'my-header': MyHeader,
            'my-footer': MyFooter,
            'wiki-subhead': WikiSubhead,
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

        .term__breadcrumb {
            margin: 0 !important;
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

        .term__rowtext {
            padding: 20px 0px;
            border-bottom: 2px solid #eee;
        }
            .rowtext-title {
                font-size: 20px;
                font-weight: 600;
                color: #1d1f1e;
                margin-bottom: 5px;
            }

            .rowtext-content {
                color: gray;
                padding-bottom: 20px;
                display: flex;
            }

            .rowtext-content:hover { 
                background-color: #f5f5f5;
            }



/* ==============================================
                #TERM-EXAMPLES
================================================= */

        .term__largerow {
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
                        margin: 5px 0px;
                        width: 150px;
                    }

                    .related__addNew {
                        font-weight: bold;
                    }

                    .related__input {
                        width: inherit;
                        width: 150px;
                    }
                    
                    .related__actions {
                        display: flex;
                        justify-content: space-between;
                    }
                        .related__save {
                            text-align: end;
                            cursor: pointer;
                        }
                        .related__close {
                            cursor: pointer;
                        }


</style>