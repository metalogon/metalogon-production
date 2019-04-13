<template>
    <div class="video">
        
        <my-header></my-header>
        
        <!-- <div class="video__breadcrumb spacer columns is-gapless is-marginless">
             <router-link :to="{ path: '/'}" class="video__breadcrumb-title column is-8">
                <button class="video__breadcrumb-title-btn button is-white">
                    <i class="fa fa-chevron-left" aria-hidden="true"></i> &nbsp {{ this.videos.title }}
                </button>
            </router-link>
        </div> -->
            <!-- <div class="video-timer column is-4">
                <span>{{ secondsToMMSS(videoCurrentTime) }}</span>
            </div>
        </div>-->
        <div class="video__body columns">
            <div class="player column is-8">
                <div id="player"></div>

                <div class="times" v-show="isVideoline">
                    <!-- <span v-for="min in times" class="times-min" v-bind:style="{ marginLeft: min.marginleft }"></span> -->
                    <!-- v-for="t in 10"  style="color: #fff; font-size: 8px;"-->
                    <span class="times-min" v-for="time in times" :key="time.min">{{ time.min }}</span> <!-- <span class="times-sec"></span><span class="times-sec"></span> -->
                </div>

                <div class="videoline" id="videoline" v-show="isVideoline">
                    <!--<span class="videoline__now-time">{{ videoCurrentTimeMMSS }}</span>-->

                    <div class="videoline-ribbon" draggable="true" v-show="false">
                        <span class="videoline-ribbon-circle"></span>
                        <span class="videoline-ribbon-line">
                            <p class="videoline-ribbon-line-time">{{ videoCurrentTimeMMSS }}</p>
                        </span>
                    </div>

                    <div class="crop videoline-crop" id="videoline-crop" >
                        <div class="crop__corner crop__start" draggable="true">
                            <span>|||</span>
                            <!--<span>&nbsp;</span>-->
                            <!--<div class="crop__grab" style="margin-left: -10px"> 
                                <span>||</span>
                            </div>-->
                            <p class="crop__time-label">{{ startDragTime }}</p>
                        </div>
                        <div class="crop__corner crop__end" draggable="true">
                            <span>|||</span>
                            <!--<div class="crop__grab">
                                <span>||</span>
                            </div> -->
                            <p class="crop__time-label">{{ endDragTime }}</p>
                        </div>
                        <span class="crop__space"></span>
                    </div>

                    <div class="videoline-progress" v-show="false">
                    </div>
                </div>

                <div class="annotate" v-show="isAnnotating">
                    <!-- Loading -->
                    <div class="uploadvid__sync-load" 
                        v-loading="loadingCanons" 
                        v-if="loadingCanons"
                        element-loading-text="Loading..." 
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
                    <div class="annotate-menu" v-show="!loadingCanons"> 
                        <nav class="annotate-menu__canons" v-if="isAnnotateCanons">
                            <a :class="canon.name" @click="chooseCanonAnnotate(canon.name)" v-for="canon in customCanonTree" :key="canon.name" >{{ canon.name }}</a>
                            <div class="annotate-menu__canons-close">
                                <span @click="closeAnnotationMenu()">X</span>
                            </div>
                        </nav>
                        <nav class="annotate-menu__categories" v-for="canon in customCanonTree" :key="canon.name" v-if="isAnnotateCategories && canon.name === annotateCanon">
                            <a :class="canon.name" v-for="cat in canon.categories" :key="cat.name" @click="chooseCategoryAnnotate(cat.id)" :title="cat.desc">{{ cat.name }}</a>  
                        </nav>
                        <nav class="annotate-menu__subcategories" v-if="isAnnotateSubcategories">
                            <button class="button" @click="isAnnotateSubcategories = false;isAnnotateCategories = true; isAnnotateCanons = true;"><i class="fa fa-chevron-left"></i>Back</button>
                            <a v-for="subcategory in annotateCurrentCategoryObject.subcategories" :key="subcategory.id" @click="chooseSubcategoryAnnotate(subcategory.id)">{{ subcategory.name }}</a>  
                        </nav>
                    </div>

                    <div class="annotate-fields annotate-annotating" v-show="isAnnotateFields"> 
                        <!-- :class="annotateCanon" -->
                        <div class="annotate-fields-left">
                            <button class="button annotate-fields-left-back" @click="isAnnotateFields = false; isVideoline = false; isAnnotateCategories = true; isAnnotateCanons = true; selectedMove = 'Other'">
                                <i aria-hidden="true" class="fa fa-chevron-left"></i>Back
                            </button>
                        </div>
                        
                        <div class="annotate-fields-right">
                            <div class="annotate-desc field">
                                <!-- If has no subcategories -->
                                <div class="annotate-desc-text" v-if="annotateCurrentCategoryObject.subcategories.length === 0">
                                    <h1>{{ annotateCurrentCategoryObject.name }}</h1>
                                    <p>{{ annotateCurrentCategoryObject.definition }}</p>
                                </div>
                                <!-- If has subcategories -->
                                <div class="annotate-desc-text" v-else>
                                    <h1>{{ annotateCurrentSubcategoryObject.name }}</h1>
                                    <p>{{ annotateCurrentSubcategoryObject.definition }}</p>
                                </div>
                                <router-link :to="'/term/' + annotateCurrentCategoryObject.id" tag="a" class="annotate-desc-text__wiki"> <!-- target="_blank" -->
                                    <i class="fa fa-commenting"></i>Wiki
                                </router-link>
                                <div class="annotate-menu__canons-close"><span @click="isAnnotating = false; isAnnotateFields = false; isVideoline = false; selectedMove = 'Other';">X</span></div>
                            </div>  
                            <div class="annotate-comment field" v-show="selectedMove === 'Other'">
                                <label class="label">Comment</label>
                                <p class="control">
                                    <textarea class="textarea" placeholder="You might also want to include a concrete strategy recommendation." v-model="annotateComment"></textarea>
                                </p>
                            </div>
                            <div class="annotate-effectiveness field">
                                <label class="label">Effectiveness rating</label>
                                <el-slider v-model="annotateRating" :step="1" :min="0" :max="5" 
                                        show-stops 
                                        show-tooltip class="annotate-effectiveness-slider">
                                </el-slider>
                            </div>
                            <div class="annotate-submit">
                                <button class="button" @click="annotate()">Annotate</button>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div class="edit" v-show="isEditing">
                    <!-- FUTURE
                        <div class="annotate-menu" v-show="isEditMenu">
                            <nav class="annotate-menu__canons">
                                <a @click="chooseCanonAnnotate(c.name, $event)" v-for="c in customCanonTree">{{ c.name }}</a>
                                <div class="annotate-menu__canons-close"><span @click="isEditing = false">X</span></div>
                            </nav>
                            <nav class="annotate-menu__categories" v-for="canon in customCanonTree" v-if="canon.name === annotateCanon">
                                <a v-for="cat in canon.categories" @click="chooseCategoryAnnotate(cat.name)" v-bind:title="cat.description">{{ cat.name }}</a>  
                            </nav>
                        </div> 
                    -->
                    <div class="annotate-fields" v-show="isEditFields">
                        <!-- FUTURE
                            <div class="annotate-fields-left">
                                <button class="button is-black" @click="isEditMenu = true; isEditFields = false; isVideoline = false">
                                    <i aria-hidden="true" class="fa fa-chevron-left"></i>Back
                                </button>
                            </div>
                        -->
                        <div class="annotate-fields-right">
                            <div class="annotate-desc field" v-for="canon in customCanonTree" :key="canon.name" v-if="canon.name === annotateCanon">
                                <p class="control" v-for="cat in canon.categories" :key="cat.id" v-if="cat.id === annotateCategoryId">"{{ cat.description }}"</p>
                                <div class="annotate-menu__canons-close"><span @click="isEditing = false; isVideoline = false; isEditFields = false; isAnnotating = false">X</span></div>
                            </div>
                            <div class="annotate-effectiveness field">
                                <label class="label">Set effectiveness:</label>
                                <el-slider v-model="editRating" :step="1" :min="0" :max="5" 
                                        show-stops 
                                        show-tooltip class="annotate-effectiveness-slider">
                                </el-slider>
                            </div>
                            <div class="annotate-comment field">
                                <label class="label">Comment:</label>
                                <p class="control">
                                    <textarea class="textarea" placeholder="It is always a good idea to include strategy hint..." 
                                            v-model="editComment">
                                    </textarea>
                                </p>
                                <div class="annotate-submit">
                                    <button class="button" @click="edit()">Save</button>
                                </div>
                            </div>
                            <div class="field" style="color: #fff; font-size: 0.8em;">
                                Start time:
                                <input type="text" v-model="editStart">
                                End time:
                                <input type="text" v-model="editEnd">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="add-annotation-area" @click="annotating()" v-show="!isAnnotating">
                    <i class="fa fa-plus fa_1_5x" aria-hidden="true"></i><span>Add annotation</span>
                </div>

                <router-link to="/" class="collaborators button" v-if="currentClass.name !== 'Home'" tag="button" active-class="head__nav-item-active" exact><i class="fa fa-chevron-left"></i> Back to class</router-link>
                <button class="collaborators button" @click="toggleModalCollaborators()">
                    <i class="fa fa-users"></i><span>Collaborators</span>
                </button>
                <video-assignments :currentVideo="videos"></video-assignments>
                <canon-statistics :currentVideo="videos" :currentAnnotations="videoAnnotations"></canon-statistics>
                
                <el-dialog :visible.sync="modalCollaboratorsIsOpen">
                    <span class="modal-collaborators" slot="title"><b>{{videos.title}} - Collaborators</b></span>
                    <!-- Loading -->
                    <div class="uploadvid__sync-load" 
                        v-loading="loadingCollaborators" 
                        v-if="loadingCollaborators"
                        element-loading-text="Loading..." 
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
                    <el-tabs v-model="modalCollaboratorsTab" v-show="!loadingCollaborators">
                        <el-tab-pane label="Collaborators" name="collaborators">
                            <p v-show="videoCollaborators.length === 0" ><i>No collaborators</i></p>
                            <div class="mt-table">
                                <li v-for="(s, index) in videoCollaborators" :key="s.id" style="list-style:none">
                                    <span><i class="fa fa-user"></i> {{ s.firstName + " " + s.lastName}}</span>
                                    <el-button 
                                        v-if="collabEditAccess"
                                        @click="deleteCollaborator(index, s)" 
                                        size="small" type="info" style="float: right; margin: -2px;">Remove
                                    </el-button>
                                </li>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane v-if="collabEditAccess" label="Other students" name="otherStudents">
                            <div v-show="otherStudents.length === 0" ><i>No other students</i></div>
                            <el-input icon="search" v-show="otherStudents.length !== 0" v-model="searchInput" @change="filterStudentsArray('otherStudents', 'filteredOtherStudents', searchInput)" placeholder="Search for a student..." style="width:220px;margin-bottom:7px;"></el-input>
                            <div class="mt-table">
                                <li v-for="(s, index) in filteredOtherStudents" :key="s.id" style="list-style:none">
                                    <span><i class="fa fa-user"></i> {{ s.firstName + " " + s.lastName}}</span>
                                    <el-button
                                        @click="addCollaborator(index, s)" 
                                        size="small" type="info" style="float: right; margin: -2px;">Add collaborator
                                    </el-button>
                                </li>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-dialog>

            </div>

            <div class="cards column is-4">
                <div class="cards-content" v-if="canonLoadingDone">
                    <nav class="card-menu">
                        <!-- <a style="display:flex;flex-direction:column;justify-content:center;margin:5px;color:#4a4a4a;"><i class="fa fa-graduation-cap" style="text-align:center;"></i><span style="font-size:10px;margin-top:-3px;">Professor only</span></a> -->
                        <a class="card-menu__item" :class="canon.name" v-for="canon in customCanonTree" :key="canon.name"  @click="chooseCanonFilter($event, canon.name)" >
                            <i class="card-menu__icon fa fa_1x" style="margin-top:20px;" :class="{ 'fa-pencil-square-o': (canon.name === 'Invention'), 'fa-book': (canon.name === 'Structure'), 'fa-commenting': (canon.name === 'Delivery'), 'fa-eye': (canon.name === 'Visuals'), 'fa-diamond': (canon.name === 'Style') }"></i>
                            <span class="card-menu__title">{{ canon.name }}</span>
                            <div class="card-menu__triangle" :class="canon.name + '-border-triangle'" ></div> 
                        </a>
                        <div id="more-annotations" class="more-annotations">
                            Scroll
                            <div class="scroll-mouse">
                                <i class="scroll-wheel fa fa-circle" aria-hidden="true"></i>
                            </div>
                        </div>
                    </nav>

                    <div class="timeline-container">
                        <div class="timeline-card column" :class="card.canon + '-border'" @click="seekCard($event)" v-for="card in videoAnnotations" :key="card.id" v-if="card.canon === isInvention || card.canon === isStructure || card.canon === isDelivery || card.canon === isVisuals || card.canon === isStyle">
                            <div class="timeline-card__head">
                                <div class="timeline-card__title-container">
                                    <!-- category[0].name IS FROM /viewannotation -->
                                    <span class="timeline-card__title">{{ card.category[0].name }}</span>
                                    <span class="timeline-card__time">{{ card.from }} - {{ card.to }}</span>
                                    <!-- <img src="../../assets/big-idea.svg"> -->
                                </div>
                                <p class="timeline-card__desc">{{ card.label }}</p>                                
                            </div>
                            <div class="timeline-card__body" @click.stop.prevent>
                                <p class="timeline-card__body-title" v-show="!!card.comment">COMMENT:</p>
                                <read-more class="timeline-card__comment" v-if="!!card.comment" :text="card.comment" more-str="Read More" link="#" less-str="Read less" :max-chars="70"></read-more> 
                                <div class="timeline-card__effectiveness">
                                    <div class="timeline-card__progress">
                                        <span class="timeline-card__progressSpan" :style="{ width: 20 * card.rating + '%' }" :class="card.canon"></span>
                                    </div>
                                    <!-- <el-progress :stroke-width="11" :percentage="20 * card.rating" :show-text="false" status="fail"></el-progress> -->
                                    <!-- <progress class="progress is-small is-info" v-bind:value="20 * card.rating" max="100"></progress> -->
                                    <p class="timeline-card__effectiveness-label">{{ card.rating }} / 5 effective</p>
                                </div>
                            </div>
                            <div class="timeline-card__author">{{ card.author }}</div>
                            <div class="timeline-card__footer">
                                <!-- <div class="timeline-card__comment">authorName</div> -->
                                <!-- TODO This line is buggy. This should print the author of the annotation on the annotation card -->
                                <span class="timeline-card__id">{{ card.id }}</span>
                                <div class="timeline-card__edit-container" @click.stop.prevent>
                                    <button class="edit-buttons-moreLess button" @click="toggleEditDelete($event)"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>
                                    <button class="edit-buttons edit-buttons-edit button" @click="editing($event)"><i class="fa fa-pencil-square-o fa-1x" aria-hidden="true"></i></button>
                                    <button class="edit-buttons edit-buttons-delete button" @click="deleteAnnotation($event)"><i class="fa fa-trash-o fa-1x" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="errorhandling column" v-if="false">
                    <div class="errorhandling__head">
                        <div class="errorhandling__title-container">
                            <span class="errorhandling__title">NOTIFICATION</span>
                        </div>
                    </div>
                    <div class="errorhandling__body">
                        <p class="errorhandling__body-title" >The annotations of the current video, are not shown correctly. Please contact with the administrator.</p>
                    </div>
                    <div class="errorhandling__footer">
                        Contact
                    </div>
                </div>
            </div>
        </div>

        <my-footer></my-footer>

        <el-dialog class="uploadvid__sync" :visible.sync="modalSyncOpen" :close-on-click-modal="false" :show-close="false">
            <div class="uploadvid__sync-load" 
                v-loading="modalSyncOpen" 
                element-loading-text="Processing your file..." 
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"></div>
            <button class="button" @click="goHome()">Go home</button>
        </el-dialog>
        
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { mapMutations } from 'vuex'
    import _ from 'lodash'
    import MyHeader from '../Layout/MyHeader.vue'
    import MyFooter from '../Layout/MyFooter.vue'
    import CanonStatistics from '../Extra/CanonStatistics.vue'
    import VideoAssignments from '../Extra/VideoAssignments.vue'

    import { Loading } from 'element-ui';

    export default {
        data() {
            return {
                player: null,
                clickCoords: 0,
                videoDuration: 0,
                // videoAnnotations: [],
                videoDurationMMSS: 0,
                videoCurrentTime: 0,
                videoCurrentTimeMMSS: 0,
                videoIndex: 0,
                // ANNOTATE SECTION
                customCanonTree: [],
                loadingCanons: false,
                isAnnotating: false,
                annotateCanon: 'Delivery',
                annotateCanonName: 0,
                annotateCategoryId: '', // The category id from the category that is chosen.
                annotateSubcategoryId: '', // The subcategory id from the category that is chosen.
                annotateCurrentCategoryObject: { canon: '', description: '', id: '', name: '', subcategories: [] },
                annotateCurrentSubcategoryObject: {},
                annotateRating: 0,
                annotationType: 'category', // or 'subcategory': Helps the POST /annotation to send the correct categoryId. 
                annotateComment: '',
                annotateStart: null,
                annotateEnd: null,
                editRating: null,
                editComment: '',
                editStart: null,
                editEnd: null,
                editingCard: null,
                isAnnotateCanons: false, // Canons menu.
                isAnnotateCategories: false, // Categories menu.
                isAnnotateSubcategories: false, // Subcategories menu.
                isAnnotateFields: false,
                isVideoline: false,
                isEditing: false,
                // isEditMenu: false,
                isEditFields: false,
                isDragging: false,
                startDragTime: 0,
                endDragTime: 0,
                // END OF ANNOTATE SECTION
                filterCanon: 'All',
                isInvention: 'Invention',
                isStructure: 'Structure',
                isDelivery: 'Delivery',
                isVisuals: 'Visuals',
                isStyle: 'Style',
                isAll: '',
                times: [],
                toggleCardEditButton: false,
                dragEndIsMoving: false,
                annotationPauseTime: 0,
                id: '',
                selectedMove: 'Other',
                otherInventionelected: false,
                // Collaborations
                collabEditAccess: false, // If user is already a collaborator then he can edit collaborators
                modalCollaboratorsIsOpen: false,
                loadingCollaborators: false,
                modalCollaboratorsTab: 'collaborators',
                searchInput: '',
                otherStudents: [], // Class enrolled students that are not collaborated with this video
                filteredOtherStudents: [],
                // End collaborations
                authService: this.$root.$options.authService,
                modalSyncOpen: false,
                secureHTTPService : this.$root.$options.secureHTTPService,
                authData: {},
                role: '',
                currentRoute: '',
                loadingInstance: null,
                canonLoadingDone: false            }
        },
        methods: {
            chooseCanonAnnotate(canon) {
                // The event that is fired, 
                // when a user clicks on annotate menu canons.
                // @param {string} canon. The canon name "Structure", "Style", etc.

                this.annotateCanon = canon
            },
            findCatId(id, array) {
                for(var i in array) {
                    if (array[i] === id) {
                        return true
                    }
                }
                return false
            },
            copy(o) {
                var output, v, key
                output = Array.isArray(o) ? [] : {}
                for (key in o) {
                    v = o[key]
                    output[key] = (typeof v === "object") ? this.copy(v) : v
                }
                return output
            },
            createCustomCanonTree(idArray) {
                // Use the basic canon tree to create a custom one based on the idArray
                // Deep copy basic tree
                this.customCanonTree = this.copy(this.canons)
                var cans = this.customCanonTree
                for(var can in cans) {
                    var cats = this.customCanonTree[can].categories
                    for(var cat = 0; cat < cats.length; cat++) {
                        if (cats[cat].subcategories.length != 0) {
                            var subcats = cats[cat].subcategories
                            for (var subcat = 0; subcat < subcats.length; subcat++) {
                                // FIND ID IN ID ARRAY, FALSE -> DELETE SUBCAT
                                if (!this.findCatId(subcats[subcat].id, idArray)) {
                                    // console.log("found subcat")
                                    subcats.splice(subcat, 1)
                                    subcat --
                                    if (subcats.length == 0) {
                                        cats.splice(cat, 1)
                                        cat --
                                    }
                                    if (cats.length == 0) {
                                        delete cans[can]
                                        break
                                    }
                                }
                            }
                        }
                        else if (cats[cat].subcategories.length == 0) {
                            // FIND ID IN ID ARRAY, FALSE -> DELETE CAT
                            if (!this.findCatId(cats[cat].id, idArray)) {
                                // console.log("found cat")
                                cats.splice(cat, 1)
                                cat --
                                if (cats.length == 0) {
                                    delete cans[can]
                                    break
                                }
                            }
                        }
                    }
                }
            },
            chooseCategoryAnnotate(currentCategoryId) {
                // The event that is fired, 
                // when a user clicks on annotate menu categories.
                // @param {string} currentCategoryId. The category id that has been clicked.

                this.annotateCategoryId = currentCategoryId
                this.isAnnotateCanons = false

                // Fills the current category object.
                // Need to find where the annotateCanon is in customCanonTree due to 
                // the fact that customCanonTree is array of objects, not object of objects
                for (var can in this.customCanonTree) {
                    if (this.customCanonTree[can].name === this.annotateCanon) {
                        // console.log("found canon!", can)
                        this.annotateCanonName = can
                        break
                    }
                }
                var categories = this.customCanonTree[this.annotateCanonName].categories
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i].id === currentCategoryId) {
                        this.annotateCurrentCategoryObject = categories[i]
                    }
                }

                // If there no subcategories -> show annotation fields
                // Else there are subcategories -> show subcategory menu
                if (this.annotateCurrentCategoryObject.subcategories.length === 0) {
                    this.annotationType = 'category'
                    this.isAnnotateCanons = false
                    this.isAnnotateCategories = false
                    this.isAnnotateFields = true
                    this.isVideoline = true
                } else {
                    this.annotationType = 'subcategory'
                    this.isAnnotateCategories = false
                    this.isAnnotateSubcategories = true
                }

            },
            chooseSubcategoryAnnotate(currectSubcategoryId) {
                // The event that is fired, 
                // when a user clicks on annotate menu subcategories.
                // This applies on some of the canons, such as "Invention".
                // @param {string} currectSubcategoryId. The subcategory id that has been clicked.

                this.annotateSubcategoryId = currectSubcategoryId

                // Fills the current subcategory object.
                for (var i = 0; i < this.annotateCurrentCategoryObject.subcategories.length; i++) {
                    if (this.annotateCurrentCategoryObject.subcategories[i].id === this.annotateSubcategoryId) {
                        this.annotateCurrentSubcategoryObject = this.annotateCurrentCategoryObject.subcategories[i]
                    }
                }
                
                this.isAnnotateSubcategories = false
                this.isAnnotateCanons = false
                this.isAnnotateFields = true 
                this.isVideoline = true
            },
            annotating() {
                var self = this
                this.loadingCanons = true
                // Checking for new annotations in current video (for real time annotating)
                this.$store.dispatch('getVideoAnnotations', this.id)

                // Custom categories trees
                // Find the customized tree for this video's genre
                var self = this

				// this.$store.dispatch('getGenres')
				// .then(function() {
				// 	for (var g = 0; g < self.currentClass.catFilter.length; g++) {
                //         if (self.currentClass.catFilter[g].genreId === self.videos.genre) {
                //             self.createCustomCanonTree(self.currentClass.catFilter[g].selectedNodes)
                //             break
                //         }
                //     }
                //     self.loadingCanons = false
                // })

                self.loadingCanons = false

                this.isAnnotating = true
                this.isAnnotateCanons = true // Opens canons menu.
                this.isAnnotateCategories = true
                this.annotateRating = 0
                this.annotateComment = ''
                this.selectedMove = 'Other'
                if (this.player.getState() === 'playing') 
                    this.player.pause()

                this.annotationPauseTime = this.player.getPosition();
                
                // Set times array
                this.setTimes()

                // setStartEndPosition()
                var annotationNowTime = this.videoCurrentTime - 5 // 5 seconds before pause
                var barWidth = $('.player').width() 

               // "out of bounds" exception
                if (this.annotationPauseTime < 0) 
                    annotationNowTime = 0

                var coordsPercentStart = (annotationNowTime * 100) / parseInt(self.videoDuration)
                // 10 seconds after "start"
                var coordsPercentEnd = ((annotationNowTime + 10)  * 100) / parseInt(self.videoDuration)
                if (coordsPercentEnd > 100) 
                    coordsPercentEnd = 100

                // var coordsStart = (coordsPercentStart * barWidth) / 100
                // var coordsEnd = (coordsPercentEnd * barWidth) / 100
                var middleCoords = barWidth / 2
                var coordsStart = middleCoords - 10
                var coordsEnd = middleCoords + 10

                $('.crop__start').css('left', coordsStart)

                $('.crop__start').css('left', coordsStart)
                $('.crop__end').css('left', coordsEnd)
                $('.crop__space').css('left', coordsStart)
                $('.crop__space').css('width', coordsEnd - coordsStart)

                this.annotateStart = this.secondsToMMSS(this.annotationPauseTime - 5)
                this.annotateEnd = this.secondsToMMSS(this.annotationPauseTime + 25)

                this.startDragTime = this.secondsToMMSS(this.annotationPauseTime - 5)
                this.endDragTime = this.secondsToMMSS(this.annotationPauseTime + 25)

                // "out of bounds" exception
                if ((self.videoDuration - annotationNowTime) < 90) {
                    this.startDragTime = this.secondsToMMSS(annotationNowTime)
                    this.endDragTime = this.secondsToMMSS(this.videoDuration)
                } 

                // START
                $( ".crop__start" ).draggable({
                    cursor: "col-resize",
                    axis: "x",
                    containment: "#videoline",
                    scroll: false,
                    revert: false,
                    start(){
                         self.isDragging = true
                    },
                    drag(event) {
                        var revert = $( ".crop__start" ).draggable( "option", "revert" );
                        var cropWidth = $('.crop__end').position().left - $('.crop__start').position().left
                        if (cropWidth < 0) {
                            $( ".crop__start" ).draggable( "option", "revert", true );
                        } else {
                            $( ".crop__start" ).draggable( "option", "revert", false );
                            self.isDragging = true
                            var clickCoords = $('.crop__start').position().left
                            var clickCoordsPercent = ( clickCoords / $('.videoline').width() ) * 100

                            var clipLeft = $('.crop__start').position().left
                            var clipWidth = $('.crop__end').position().left - $('.crop__start').position().left
                            $('.crop__space').css('left', clipLeft)
                            $('.crop__space').css('width', clipWidth)

                            // "out of bounds" exception
                            if (clickCoords < 0) {
                                clickCoords = 0
                            } else if (clickCoords > barWidth) { 
                                clickCoords = barWidth
                            }
                            var clickCoordsPercent = ( clickCoords / $('.videoline').width() ) * 100
                            // 3 minutes scaling
                            var clickTime = (clickCoordsPercent * 180) / 100

                            if (self.annotationPauseTime < 90)
                                var targetTime = clickTime
                            else
                                var targetTime = clickTime + self.annotationPauseTime - 90
                            // Third scenario remaining (self.videoDuration - self.annotationPauseTime) < 90

                            self.player.seek(targetTime)
                            targetTime = self.secondsToMMSS(targetTime)
                            self.annotateStart = targetTime
                            self.startDragTime = targetTime
                        }
                    },
                    stop(event) {
                        self.isDragging = false
                        //var windowOffset = $('.videoline').offset().left
                        var clickCoords = $('.crop__start').position().left
                        // "out of bounds" exception
                        if (clickCoords < 0) {
                            clickCoords = 0
                        } else if (clickCoords > barWidth) { 
                            clickCoords = barWidth
                        }
                        var clickCoordsPercent = ( clickCoords / $('.videoline').width() ) * 100
                        // 3 minutes scaling
                        var clickTime = (clickCoordsPercent * 180) / 100

                        if (self.annotationPauseTime < 90)
                            var targetTime = clickTime
                        else
                            var targetTime = clickTime + self.annotationPauseTime - 90

                        self.player.seek(targetTime)
                        self.player.pause()
                        targetTime = self.secondsToMMSS(targetTime)
                        self.annotateStart = targetTime
                        self.startDragTime = targetTime
                        
                        //In case self cropWidth < 0, the crop__space should be drawn again
                        var clipLeft = $('.crop__start').position().left
                        var clipWidth = $('.crop__end').position().left - $('.crop__start').position().left
                        $('.crop__space').css('left', clipLeft)
                        $('.crop__space').css('width', clipWidth)
                        clickTime = self.secondsToMMSS(clickTime)
                    }
                })

                // END
                $( ".crop__end").draggable({
                    cursor: "col-resize",
                    axis: "x",
                    containment: "#videoline",
                    scroll: false,
                    revert: false,
                    start() {
                        self.isDragging = false
                    },
                    drag(event) {
                        var revert = $( ".crop__end" ).draggable( "option", "revert" );
                        var cropWidth = $('.crop__end').position().left - $('.crop__start').position().left
                        if(cropWidth < 0) {
                            $( ".crop__end" ).draggable( "option", "revert", true );
                        } else {
                            $( ".crop__end" ).draggable( "option", "revert", false );
                            self.isDragging = false
                            // var windowOffset = $('.videoline').offset().left
                            var clickCoords = $('.crop__end').position().left
                            var clickCoordsPercent = ( clickCoords / $('.videoline').width() ) * 100
                            // var clickTime = (clickCoordsPercent * self.videoDuration) / 100
                            // self.player.seek(clickTime)
                            var clipLeft = $('.crop__start').position().left
                            var clipWidth = $('.crop__end').position().left - $('.crop__start').position().left
                            $('.crop__space').css('left', clipLeft)
                            $('.crop__space').css('width', clipWidth)
                            // clickTime = self.secondsToMMSS(clickTime)

                            // "out of bounds" exception
                            if (clickCoords < 0) {
                                clickCoords = 0
                            } else if (clickCoords > barWidth) { 
                                clickCoords = barWidth
                            }
                            var clickCoordsPercent = ( clickCoords / $('.videoline').width() ) * 100
                            // 3 minutes scaling
                            var clickTime = (clickCoordsPercent * 180) / 100
                            if (self.annotationPauseTime < 90) {
                                var targetTime = clickTime
                            } else {
                                var targetTime = clickTime + self.annotationPauseTime - 90
                            }
                            self.player.seek(targetTime)
                            targetTime = self.secondsToMMSS(targetTime)
                            self.annotateEnd = targetTime
                            self.endDragTime = targetTime
                        }
                    },
                    stop(event) {
                        self.isDragging = false
                         //var windowOffset = $('.videoline').offset().left
                        var clickCoords = $('.crop__end').position().left
                        // "out of bounds" exception
                        if (clickCoords < 0) {
                            clickCoords = 0
                        } else if (clickCoords > barWidth) { 
                            clickCoords = barWidth
                        }
                        var clickCoordsPercent = ( clickCoords / $('.videoline').width() ) * 100
                        // 3 minutes scaling
                        var clickTime = (clickCoordsPercent * 180) / 100
                        if (self.annotationPauseTime < 90)
                            var targetTime = clickTime
                        else
                            var targetTime = clickTime + self.annotationPauseTime - 90
                    
                        self.player.seek(targetTime)
                        self.player.pause()
                        targetTime = self.secondsToMMSS(targetTime)
                        self.annotateEnd = targetTime
                        self.endDragTime = targetTime
                        
                        // In case that cropWidth < 0, the crop__space should be drawn again
                        var clipLeft = $('.crop__start').position().left
                        var clipWidth = $('.crop__end').position().left - $('.crop__start').position().left
                        $('.crop__space').css('left', clipLeft)
                        $('.crop__space').css('width', clipWidth)
                        clickTime = self.secondsToMMSS(clickTime)
                    }
                })
            },
            annotate() {
                // If other is enable, then show the annotation comment 
                var theComment = ''

                if (this.selectedMove === 'Other')
                    theComment = this.annotateComment
                else
                    theComment = this.selectedMove

                // Find the definition of the chosen annotate category.
                // This is for category annotation only.
                var annotateDesc
                var annotateCategories = this.customCanonTree[this.annotateCanonName].categories
                for (var i = 0, l = annotateCategories.length; i < l; i++) {
                    if (this.annotateCategoryId === annotateCategories[i].id) {
                        annotateDesc = annotateCategories[i].definition
                    }
                }


                var theLabel
                if (this.annotationType === 'category') {
                    theLabel = annotateDesc
                    console.log('category')
                } else {
                    if (Object.keys(this.annotateCurrentSubcategoryObject.definition).length === 0) {
                        theLabel = "-"
                    } else {
                        theLabel = this.annotateCurrentSubcategoryObject.definition
                    }
                }
                var card = { 
                    author: this.authService.getAuthData().firstName + ' ' + this.authService.getAuthData().lastName.slice()[0] + '.', // Alexander T.
                    videoId: this.id,
                    canon: this.annotateCanon,
                    categoryId: (this.annotationType === 'category') ? this.annotateCategoryId : this.annotateSubcategoryId,
                    label: theLabel,
                    comment: theComment,
                    from: this.annotateStart,
                    to: this.annotateEnd, 
                    rating: this.annotateRating,
                }

                // Pushing new annotation in current video
                if (card.rating === null) {
                    alert('Please set a rate.')
                } else {
                    this.$store.dispatch('addAnnotation', card)
                    // this.$store.dispatch('getVideoAnnotations', this.id) // The store update is necessary because we show the cards according to /viewannotation
                    
                    // Seek to previous paused time.
                    this.player.seek(this.mmssToSeconds(this.annotateStart))

                    // Reset default design states (no annotating)
                    this.annotateComment = ''
                    this.annotateStart = null
                    this.annotateEnd = null
                    this.annotateRating = 0
                    this.isAnnotating = false
                    this.isAnnotateCanons = false
                    this.isAnnotateFields = false
                    this.isVideoline = false
                    this.selectedMove = 'Other'
                }
            },
            closeAnnotationMenu() {
                this.isAnnotating = false
                this.isAnnotateCanons = false
                this.isAnnotateSubcategories = false

                this.annotateCategoryId = ''
                this.annotateSubcategoryId = ''
            },
            editing(event) {
                // This is logically incorrect, but it works with the current implementation.
                this.isAnnotating = true 
                // CHECKING for new annotations in current video (for real time annotating)
                this.$store.dispatch('getVideoAnnotations', this.id)

                // Hide the Edit and Delete buttons
                $(event.currentTarget).hide(); $(event.currentTarget.parentElement).find('.edit-buttons').hide()

                // The card that is being editing. It is a DOM object. 
                // <div class="timeline-card">
                var editingCard = event.currentTarget.parentElement.parentElement.parentElement
                this.editingCard = editingCard

                // Setting flags
                this.isEditing = true
                this.isEditFields = true
                if (this.player.getState() === 'playing')
                    this.player.pause()

                if (this.isAnnotating) {
                    this.isAnnotateFields = false
                    this.isAnnotateCanons = false
                    this.isVideoline = false
                }

                // Setting from + to annotate times
                var time = $(editingCard).find('.timeline-card__time').text() // 03:05 - 03:17
                var startTime = time.substring(0,5); // 03:05
                this.editStart = startTime
                var endTime = time.substring(8,13); // 03:17
                this.editEnd = endTime
                var totalTime = this.videoDuration;

                var a = startTime.split(':')
                var b = endTime.split(':')
                var startSec = (+a[0]) * 60 + (+a[1]) // in sec
                var endSec = (+b[0]) * 60 + (+b[1]) // in sec

                // Move the timeline according to the editStart & editEnd vars
                var barWidth = $('.player').width()
                var coordsPercentStart = (startSec  * 100) / this.videoDuration
                var coordsStart = (coordsPercentStart * barWidth) / 100
                var coordsPercentEnd = (endSec * 100) / this.videoDuration
                var coordsEnd = (coordsPercentEnd * barWidth) / 100

                $('.crop__start').css('left', coordsStart)
                $('.crop__end').css('left', coordsEnd)
                $('.crop__space').css('left', coordsStart)
                $('.crop__space').css('width', coordsEnd - coordsStart)

                // Render edit effectiveness
                var cardRating = $(editingCard).find('.timeline-card__effectiveness-label').text().slice(0,1) // e.g. '3' in string
                cardRating = parseInt(cardRating) // string => int
                this.editRating = cardRating

                // Render edit comment
                var cardComment = $(editingCard).find('.timeline-card__comment p').text()
                this.editComment = cardComment

                var cardId = $(editingCard).find('.timeline-card__id').text()
                var self = this

                this.secureHTTPService.get("annotation/" + cardId)
                    .then(function (response)
                    {
                        self.editComment = response.data.data.comment
                    })
                    .catch(function (err) {
                        alert('Sorry, but annotation editing is not working right now. Try again later. ')
                        console.log('GET /annotation error: ', err)
                        // Closing editing mode section.
                        self.isEditing = false
                        self.isEditFields = false
                    })
            },
            edit() {
                var editingCard = this.editingCard
                var cardId = $(editingCard).find('.timeline-card__id').text()

                var videoBody = { comment: this.editComment, from: this.editStart, to: this.editEnd, rating: this.editRating }
                this.$store.dispatch('editAnnotation', { annotationId: cardId, body: videoBody })

                this.isEditFields = false
                this.isEditing = false
                this.isVideoline = false
                this.isAnnotating = false
            },
            deleteAnnotation(event) {
                var self = this
                
                // CHECKING for new annotations in current video (for real time annotating)
                // this.$store.dispatch('getVideoAnnotations', this.id)

                var editingCard = $(event.currentTarget).parent().parent()
                console.log("editingCard= ", editingCard)

                // Get annotation id
                var cardID = $(editingCard).find('.timeline-card__id').text()
                // cardID = parseInt(cardID)
                console.log("cardID", cardID)

                // Hide .edit-buttons
                $(event.currentTarget).hide()
                $(event.currentTarget).siblings('.edit-buttons').hide()

                var cardTitle = $(editingCard).find('.timeline-card__title').text()

                // Are you sure to Delete annotation?
                swal({
                    title: "Delete annotation?",
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: 'gdray',
                    confirmButtonText: 'Delete'
                    }).then(function () {
                        // Refresh fix
                        // self.player.seek(self.mmssToSeconds(self.videoAnnotations[self.id].from))

                        self.$store.dispatch('deleteAnnotation', cardID)
                    },
                )
            },
            annotateModeActiveItemProblem(event) {
                var children = event.currentTarget.parentNode.children
                for (var i=0; i < children.length; i++) {
                    children[i].style.backgroundColor = "transparent"
                    children[i].style.color = "#FFFFFF"
                }
                event.currentTarget.style.backgroundColor = "#27314d"
                event.currentTarget.style.color = "#FFFFFF"
            },
            chooseCanonFilter(event, canon) {
                var triangleActiveElement = event.currentTarget.getElementsByClassName('card-menu__triangle')[0] // When the canon is active.
                var triangleDisabledElement = event.currentTarget.children[2] // When the canon is disabled.

                if (canon === 'Invention') {
                    if (this.isInvention !== '')  {
                        this.isInvention = ''
                        triangleActiveElement.classList.remove("card-menu__triangle")
                        event.currentTarget.style.padding = '20px'
                        event.currentTarget.style.paddingTop = '0px'
                    }
                    else {
                        this.isInvention = 'Invention'
                        triangleDisabledElement.classList.add("card-menu__triangle")
                        event.currentTarget.style.padding = '0px'
                    }
                }
                if (canon === 'Structure') {
                    if (this.isStructure !== '') {
                        this.isStructure = ''
                        triangleActiveElement.classList.remove("card-menu__triangle")
                        event.currentTarget.style.padding = '20px'
                        event.currentTarget.style.paddingTop = '0px'
                    }
                    else {
                        this.isStructure = 'Structure'
                        triangleDisabledElement.classList.add("card-menu__triangle")
                        event.currentTarget.style.padding = '0px'
                    } 
                }
                if (canon === 'Delivery') {
                    if (this.isDelivery !== '') {
                        this.isDelivery = ''
                        triangleActiveElement.classList.remove("card-menu__triangle")
                        event.currentTarget.style.padding = '20px'
                        event.currentTarget.style.paddingTop = '0px'
                    }
                    else {
                        this.isDelivery = 'Delivery'
                        triangleDisabledElement.classList.add("card-menu__triangle")
                        event.currentTarget.style.padding = '0px'
                    }
                } 
                if (canon === 'Visuals') {
                    if (this.isVisuals !== '') {
                        this.isVisuals = ''
                        triangleActiveElement.classList.remove("card-menu__triangle")
                        event.currentTarget.style.padding = '20px'
                        event.currentTarget.style.paddingTop = '0px'
                    }
                    else { 
                        this.isVisuals = 'Visuals'
                        triangleDisabledElement.classList.add("card-menu__triangle")
                        event.currentTarget.style.padding = '0px'
                    }
                }
                if (canon === 'Style') {
                    if (this.isStyle !== '') {
                        this.isStyle = ''
                        triangleActiveElement.classList.remove("card-menu__triangle")
                        event.currentTarget.style.padding = '20px'
                        event.currentTarget.style.paddingTop = '0px'
                    }
                    else { 
                        this.isStyle = 'Style'
                        triangleDisabledElement.classList.add("card-menu__triangle")
                        event.currentTarget.style.padding = '0px'
                    }
                }
                if (canon === 'All') {
                    if (this.isAll !== '') {
                        this.isAll = ''
                        // event.currentTarget.style.backgroundColor = "transparent"
                        // event.currentTarget.style.color = "#4a4a4a"
                    }
                    else { 
                        this.isAll = 'All'
                        // event.currentTarget.style.backgroundColor = "#39425C"
                        // event.currentTarget.style.color = "#FFFFFF"
                    }
                }
            },
            seekCard(event) {
                var time = event.currentTarget.getElementsByClassName('timeline-card__time')[0].innerHTML
                var startTime = time.substring(0,5); // 03:05
                this.annotateStart = startTime
                var endTime = time.substring(8,13); // 03:17
                this.annotateEnd = endTime
                var totalTime = this.videoDuration;

                var a = startTime.split(':')
                var b = endTime.split(':')
                var startSec = (+a[0]) * 60 + (+a[1]) // in sec
                var endSec = (+b[0]) * 60 + (+b[1]) // in sec

                // Seek player according to annotateStart var
                // console.log("seekCard(): ", startSec)
                this.player.seek(startSec)

                // Move the timeline according to the annotateStart & annotateEnd vars
                var barWidth = $('.player').width()
                var coordsPercentStart = (startSec  * 100) / this.videoDuration
                var coordsStart = (coordsPercentStart * barWidth) / 100
                var coordsPercentEnd = (endSec * 100) / this.videoDuration
                var coordsEnd = (coordsPercentEnd * barWidth) / 100

                $('.crop__start').css('left', coordsStart)
                $('.crop__end').css('left', coordsEnd)
                $('.crop__space').css('left', coordsStart)
                $('.crop__space').css('width', coordsEnd - coordsStart)
          
            },
            secondsToMMSS(s) {
                s = Number(s);

                var m = Math.floor(s % 3600 / 60);
                var s = Math.floor(s % 3600 % 60);

                return ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
            },
            mmssToSeconds(timeMMSS) {
                var timeMMSS = timeMMSS.split(":")
                return (+timeMMSS[0]) * 60 + (+timeMMSS[1]) // in sec
            },
            showAnnotateMenu() {
                $('.annotate-menu').show()
            },
            paintTimes() {
                var minPos = $('.videoline').offset().left
                var maxPos = $('.videoline').width() + $('.videoline').offset().left
                minPos = parseInt(minPos)
                maxPos = parseInt(maxPos)

                var sum = 0

                for (var i = minPos; i < maxPos; i++) {
                    this.timesArray[i] = ( i / parseInt($('.videoline').width()) ) * 100
                    sum = sum + 1
                }
                console.log(this.timesArray)
                console.log('sum = ' + sum)
                //var clickTime = (clickCoordsPercent * self.videoDuration) / 100
            },
            setTimes() {
                if (this.annotationPauseTime < 90) {
                    this.times[0] = { min: this.secondsToMMSS(0) }
                    this.times[1] = { min: this.secondsToMMSS(18) }
                    this.times[2] = { min: this.secondsToMMSS(36) }
                    this.times[3] = { min: this.secondsToMMSS(54) }
                    this.times[4] = { min: this.secondsToMMSS(72) }
                    this.times[5] = { min: this.secondsToMMSS(90) }
                    this.times[6] = { min: this.secondsToMMSS(108) }
                    this.times[7] = { min: this.secondsToMMSS(126) }
                    this.times[8] = { min: this.secondsToMMSS(144) }
                    this.times[9] = { min: this.secondsToMMSS(162) }
                    this.times[10] = { min: this.secondsToMMSS(180) }
                } else if (this.annotationPauseTime > 90 && (this.videoDuration - this.annotationPauseTime) > 90) {
                    this.times[0] = { min: this.secondsToMMSS(this.annotationPauseTime - 90) }
                    this.times[1] = { min: this.secondsToMMSS(18 + this.annotationPauseTime - 90) }
                    this.times[2] = { min: this.secondsToMMSS(36 + this.annotationPauseTime - 90) }
                    this.times[3] = { min: this.secondsToMMSS(54 + this.annotationPauseTime - 90) }
                    this.times[4] = { min: this.secondsToMMSS(72 + this.annotationPauseTime - 90) }
                    this.times[5] = { min: this.secondsToMMSS(90 + this.annotationPauseTime - 90) }
                    this.times[6] = { min: this.secondsToMMSS(108 + this.annotationPauseTime - 90) }
                    this.times[7] = { min: this.secondsToMMSS(126 + this.annotationPauseTime - 90) }
                    this.times[8] = { min: this.secondsToMMSS(144 + this.annotationPauseTime - 90) }
                    this.times[9] = { min: this.secondsToMMSS(162 + this.annotationPauseTime - 90) }
                    this.times[10] = { min: this.secondsToMMSS(180 + this.annotationPauseTime - 90) }
                } else if ((this.videoDuration - this.annotationPauseTime) < 90) {
                    this.times[0] = { min: this.secondsToMMSS(this.videoDuration - 180) }
                    this.times[1] = { min: this.secondsToMMSS(this.videoDuration - 162) }
                    this.times[2] = { min: this.secondsToMMSS(this.videoDuration - 144) }
                    this.times[3] = { min: this.secondsToMMSS(this.videoDuration - 126) }
                    this.times[4] = { min: this.secondsToMMSS(this.videoDuration - 108) }
                    this.times[5] = { min: this.secondsToMMSS(this.videoDuration - 90) }
                    this.times[6] = { min: this.secondsToMMSS(this.videoDuration - 72) }
                    this.times[7] = { min: this.secondsToMMSS(this.videoDuration - 54) }
                    this.times[8] = { min: this.secondsToMMSS(this.videoDuration - 36) }
                    this.times[9] = { min: this.secondsToMMSS(this.videoDuration - 18) }
                    this.times[10] = { min: this.secondsToMMSS(this.videoDuration) }
                }
                
            },
            hooping() {
                var self = this

                var allCards = $('.timeline-card')
                var allStartTime = []
                var allEndTime = []
                var allTimeString = []
                for (var k=0, l = allCards.length; k < l; k++) {
                    allTimeString[k] = allCards[k].children[0].children[0].children[1].innerText // 00:05 - 00:10
                    allStartTime[k] = allTimeString[k].substring(0,5)  // 00:05 
                    allEndTime[k] = allTimeString[k].substring(8,13) // 00:10 

                    allStartTime[k] = self.mmssToSeconds(allStartTime[k])
                    allEndTime[k] = self.mmssToSeconds(allEndTime[k])
                }
                
                // console.log("_________")
                for (var j=0, l = allCards.length; j < l; j++) {
                    // Checking if currentTime is between start/end time 
                    // AND if the bgcolor is white.
                    if (this.videoCurrentTime >= allStartTime[j] && this.videoCurrentTime <= allEndTime[j] && $('.timeline-card').eq(j).css('background-color') === "rgb(255, 255, 255)") {
                        // console.log('#' + j + ' annotation is in "' + $('.timeline-card').eq(j).find('.timeline-card__comment p').text() + '"')
                        $('.timeline-card').eq(j).css('background-color', '#fff293')
                        var firstCard = $('.timeline-card').eq(0)
                        $('.timeline-card').eq(j).effect('bounce',{times: 2}, 300)
                        $('.timeline-card').eq(j).insertBefore(firstCard)
                        if ($('.timeline-container').scrollTop !== 0) 
                            $('.timeline-container').animate({scrollTop:0}, 500)
                    } else if ((this.videoCurrentTime < allStartTime[j] || this.videoCurrentTime > allEndTime[j])) {
                        // console.log('#' + j + ' annotation is out "' + $('.timeline-card').eq(j).find('.timeline-card__comment p').text() + '"')
                        $('.timeline-card').eq(j).css('background-color', 'white')
                    }
                }
            },
            toggleEditDelete(event) {
                var moreLessBtn = $(event.currentTarget)

                // moreLessBtn.hide()

                if (moreLessBtn.siblings().css("display") === 'none') {
                    moreLessBtn.siblings().show()
                } else {
                    moreLessBtn.siblings().hide()
                }
            },
            filterStudentsArray: _.debounce(function (arrayName, filteredArrayName, filterString) {
                // Filters any student array
                // Requires the array's name as string in the first argument and 
                // the filtered array's name as string in the second argument and
                // the search input in the third argument

                // Define the filter method that is used above.
                var filterStudents = (queryString) => {
                    return (s) => {
                        var name = s.firstName + " " + s.lastName
                        return name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
                    }
                } 

                this[filteredArrayName] = this[arrayName].filter(filterStudents(filterString))
            }, 500),
            hasCollabEditAccess() {
                // If current user is an administrator, they have edit access by default
                // If the current user is a professor, it checks if this professor owns the class and
                // gives them edit access
                // If current user is a student, it checks if they are a collaborator, gives them editing
                // access
                if (this.role === 'administrator') {
                    this.collabEditAccess = true
                }
                else if (this.role === 'professor') {
                    this.collabEditAccess = false
                    if (this.authData.userId === this.currentClass.professorId) {
                       this.collabEditAccess = true
                    }
                }
                else { // student
                    this.collabEditAccess = false
                    for (var u = 0; u < this.videoCollaborators.length; u++) {
                        if (this.videoCollaborators[u].id === this.authData.userId) {
                            this.collabEditAccess = true
                            break
                        }
                    }
                }

            },
            updateCollaborators() {
                // This method updates the collaborators/not collaborators(the students enrolled in this class but not collaborated with this video)
                // It relies on the store's videoCollaborators, classEnrolledStudents and classEnrollments, which get updated first.
                // console.log("Video.vue updating collabs...")
                var self = this
                return this.$store.dispatch('getCollaboratorsByVideoId', this.videos.id)
                .then(function() {
                    // Update the store.classEnrolledStudents array first
                    return self.$store.dispatch('getEnrolledUsersByClassId', self.currentClass.id) 
                })
                .then(function() {
                    // console.log("Class enrolled students: ", self.classEnrolledStudents)
                    return self.$store.dispatch('getEnrollmentsByClassId', self.currentClass.id)
                })
                .then(function() {
                    // console.log("Class enrollments: ", self.classEnrollments)
                    self.otherStudents = []
                    self.filteredOtherStudents = []

                    for (var s = 0; s < self.classEnrolledStudents.length; s++) {
                        for (var e = 0; e < self.classEnrollments.length; e++) {
                            if (self.classEnrollments[e].userId === self.classEnrolledStudents[s].id) {
                                if (self.classEnrollments[e].accepted) {
                                    // Need to search for this student in collaborators
                                    // If he is a collaborator he is not pushed into otherStudents array
                                    var isCollaborator = false
                                    for (var u = 0; u < self.videoCollaborators.length; u++) {
                                        if (self.videoCollaborators[u].id === self.classEnrolledStudents[s].id)
                                            isCollaborator = true
                                    }
                                    if (!isCollaborator) {
                                        self.otherStudents.push(self.classEnrolledStudents[s])
                                        self.filteredOtherStudents.push(self.classEnrolledStudents[s])
                                    }
                                }
                            }
                        }
                    }
                    // console.log("Video.vue updated collabs")
                })
                .catch(function(err) {
                    console.log("Error while updating collaborators: ", err)
                })
            },
            toggleModalCollaborators() {
                if (this.modalCollaboratorsIsOpen) {
					this.modalCollaboratorsIsOpen = false
					this.loadingCollaborators = false
				}
				else{
					this.modalCollaboratorsIsOpen = true
					this.modalCollaboratorsTab = 'collaborators'
					this.loadingCollaborators = true
				}
				var self = this
				this.updateCollaborators()
				.then(function() {
                    self.hasCollabEditAccess()
					self.loadingCollaborators = false
				})
            },
            addCollaborator(scope, row) {
                var self = this
                this.loadingCollaborators = true
                this.$store.dispatch('createCollaboration', { videoId: this.id, userId: row.id })
                .then(function() {
                    return self.updateCollaborators()
                })
                .then(function() {
                    self.loadingCollaborators = false
                })
            },
            deleteCollaborator(scope, row) {
                var self = this
                this.loadingCollaborators = true
                this.$store.dispatch('deleteCollaboration', { videoId: this.id, userId: row.id })
                .then(function() {
                    return self.updateCollaborators()
                })
                .then(function() {
                    self.loadingCollaborators = false
                })
            },
            goHome() {
                this.$router.push('/' + this.role)
            }
        },
        created() {
        },
        mounted() {
            this.canonLoadingDone = false
            
            this.loadingInstance = Loading.service({ fullscreen: true });

            this.id = this.$route.params.id // Get video ID from URL

            var self = this
            this.$store.dispatch('getVideo', this.id)
            .then(function() {
                return self.$store.dispatch('getAllClasses')
            })
            .then(function() {
                // TODO search for class in classes, and pass the whole class object
                // TODO remove the whole search thing, add class object in video??? 
                
                // TODO Update 30/3/19: Video should have just class id and we should
                // TODO join classes/video with classId as key
                for(var c = 0; c < self.classes.length; c++) {
                    if (self.classes[c].name === self.videos.class) {
                        self.$store.commit('CURRENT_CLASS_SELECT', self.classes[c])
                        break
                    }
                }
                return self.$store.dispatch('getVideoAnnotations', self.id)
            })
            .then(function() {
                return self.$store.dispatch('getCanons')
            })
            .then(function() {
                self.canonLoadingDone = true
                self.authData = self.$root.$options.authService.getAuthData()
                self.role = self.authData.role
                self.currentRoute = self.$root.$options.router.currentRoute.name.toLowerCase()

                // this.$store.dipatch('getVideo', this.id) fills the state.videos with just THIS video
                self.videoDuration = self.videos.duration
                self.videoDurationMMSS = self.secondsToMMSS(self.videoDuration) 

                // Loads video sources: 
                // link
                // duration
                // thumb TODO
                // self.getVideoSources(vIndex)

                // Get the correct source of the video. 
                // The "sources" resource (vidSources) is an array that contains about 3-6 objects.
                // The last object = sourcesLength - 1 contains an m4a file, which we do not want.
                // So, we get the last object - 1 = sourcesLength - 2
                var sourcesLength, correctSource
                if (self.videos.hasOwnProperty("sources")) {
                    sourcesLength = self.videos.sources.length
                    correctSource = sourcesLength - 2
                }

                if (self.videos.status === 0) {
                    // self.modalSyncOpen = true // Shows loading spinner

                    // let link, duration, thumb

                    // // Fetching link and duration
                    // let intervalID = setInterval(function () {
                    //     console.log("Sending get jwconversion?videoId=jwVideoId call")
                    //     self.secureHTTPService.get("jwconversion?videoId=" + self.videos.jwVideoId)
                    //         .then( response => {
                    //             console.log(' getting conversions...')
                    //             let conversions = response.data.data.conversions
                    //             var conversionNames = ['720p', '406p', '270p', '180p']//, 'Original'] // Conversion names in order of preference
                    //             console.log("conv1: ", conversions)
                    //             var everythingReady = true // this is a trick
                    //             for (var i = 0, l = conversions.length; i < l; i++) {
                    //                 if (conversions[i].status === 'Queued' && conversions[i].template.name === '720p'){
                    //                     everythingReady = false
                    //                 }
                    //                 else if (conversions[i].status === 'Queued' && conversions[i].template.name === '406p'){
                    //                     everythingReady = false
                    //                 }
                    //                 else if (conversions[i].status === 'Queued' && conversions[i].template.name === '270p'){
                    //                     everythingReady = false
                    //                 }
                    //                 else if (conversions[i].status === 'Queued' && conversions[i].template.name === '180p'){
                    //                     everythingReady = false
                    //                 }
                    //                 // else if (conversions[i].status === 'Queued' && conversions[i].template.name === 'Original'){
                    //                 //     everythingReady = false
                    //                 // }
                    //             }
                    //             if (conversions.length === 1) everythingReady = false
                    //             if (everythingReady) {
                    //                 // Pick conversion logic
                    //                 var pickedVidIndex = 0
                    //                 var foundIt = false
                    //                 for (var n = 0; n < conversionNames.length; n++) {
                    //                     console.log("conv2: ", conversions, conversionNames[n])
                    //                     for (var i = 0, l = conversions.length; i < l; i++) {
                    //                         if (conversions[i].status === 'Ready' && conversions[i].template.name === conversionNames[n]) {
                    //                             pickedVidIndex = i
                    //                             foundIt = true
                    //                             // Do necessary stuff after picking a conversion
                    //                             link = conversions[i].link.protocol + '://' + conversions[i].link.address + conversions[i].link.path
                    //                             duration = conversions[i].duration
                    //                             console.log('|> Link: ', link)
                    //                             console.log('|> Duration: ', duration)
                                                        
                    //                             // PUT video (update link, status 1)
                    //                             self.$store.dispatch('editVideo', { 
                    //                                 videoId: self.id, 
                    //                                 videoBody: {
                    //                                     "link": link,
                    //                                     "duration": parseInt(duration),
                    //                                     "thumb": 'http://www.ulivesmart.com/wp-content/uploads/2017/05/feature-video-thumbnail-overlay.png',
                    //                                     "status": 1,
                    //                                     "featuredGlobal": false,
                    //                                     "featuredClass": false
                    //                                 } 
                    //                             })

                    //                             self.player = jwplayer('player')            
                    //                             self.player.setup({
                    //                                 file: link,
                    //                                 image: self.videos.thumb,
                    //                                 "height": $('.player').height(),
                    //                             })
                    //                             // Animate progress bar width
                    //                             self.player.on('time', function(event) {
                    //                                 if (self.player.getState() === 'playing') {
                    //                                     var totalTime = self.videoDuration;
                    //                                     var currentTime = event.position;

                    //                                     // Get the current time of video in sec
                    //                                     self.videoCurrentTime = self.player.getPosition()
                    //                                     // Convert the time to MM:SS
                    //                                     self.videoCurrentTimeMMSS = self.secondsToMMSS(self.videoCurrentTime)

                    //                                     // Scaling = 3 minutes 
                    //                                     var percentTime = (currentTime / 180) * 100;

                    //                                     $('.videoline-ribbon').animate({ left: percentTime + "%" }, 50);

                    //                                 }
                    //                             })

                    //                             self.modalSyncOpen = false  // Close loading bar
                    //                             clearInterval(intervalID)

                    //                             break
                    //                         }
                    //                     }
                    //                     if (foundIt) {
                    //                         break
                    //                     }
                    //                 }     
                    //             }                           
                    //         })
                    //         .catch( function(error) {
                    //             console.log("Couldn't get conversions \n ", error)
                    //             clearInterval(intervalID)
                    //         })
                    // }, 5000)
                }
                // else if (self.videos[vIndex].status === 1) {
                else {
                    self.player = jwplayer('player')            
                    self.player.setup({
                        file: self.videos.link,
                        image: self.videos.thumb,
                        "height": $('.player').height(),
                    })
                    // Animate progress bar width
                    self.player.on('time', function(event) {
                        if (self.player.getState() === 'playing') {
                            var totalTime = self.videoDuration;
                            var currentTime = event.position;

                            // Get the current time of video in sec
                            self.videoCurrentTime = self.player.getPosition()
                            // Convert the time to MM:SS
                            self.videoCurrentTimeMMSS = self.secondsToMMSS(self.videoCurrentTime)

                            // Scaling = 3 minutes 
                            var percentTime = (currentTime / 180) * 100;

                            $('.videoline-ribbon').animate({ left: percentTime + "%" }, 50);

                        }
                    })
                }

                self.loadingInstance.close()

                // DRAGGABLE RIBBON
                $( ".videoline-ribbon" ).draggable({
                    axis: "x",
                    containment: "#videoline",
                    scroll: false,
                    start() {

                    },
                    drag(event) {
                        var windowOffset = $('.videoline').offset().left
                        
                        var clickCoords = event.originalEvent.clientX - windowOffset; 
                        var clickCoordsPercent = ( clickCoords / $('.videoline').width() ) * 100

                        if (clickCoordsPercent < 0) {
                            clickCoordsPercent = 0
                        } else if (clickCoordsPercent > 100) {
                            clickCoordsPercent = 100
                        }
                    
                        // Scaling = 3 minutes 
                        var clickTime = (clickCoordsPercent * 180) / 100
                        
                        if (self.annotationPauseTime < 90) {
                            clickTime = clickTime // + self.annotationPauseTime
                        } else { 
                            clickTime = clickTime + self.annotationPauseTime - 90
                        }

                        self.player.seek(clickTime)      
                    },
                    stop(event) {
                    }
                })
                
                // Custom categories trees
                // Find the customized tree for this video's genre
                self.$store.dispatch('getGenres')
				.then(function() {
					for (var g = 0; g < self.currentClass.catFilter.length; g++) {
                        if (self.currentClass.catFilter[g].genreId === self.videos.genre) {
                            self.createCustomCanonTree(self.currentClass.catFilter[g].selectedNodes)
                            break
                        }
                    }
                    self.loadingCanons = false
                })
            })
        },
        updated() {
            // Fixes unknown man picture bug
            // $('.jw-logo').hide()

            // Fetches annotations of the current video (videoid = URLid)
            // Stores annotations in videoAnnotations[]
            // this.videoAnnotations = this.videos.annotations
            
            // Show "Sroll down for more" when there are more than 5 cards
            // this.moreAnnotations()

            // Color a card when videoCurrentTime is between card from and end
            this.hooping()
        },
        computed: {
            ...mapGetters([
                'videos', 'currentVideoID', 'canons', 
                'videoAnnotations', 'classEnrolledStudents', 'classes', 
                'currentClass', 'classEnrollments', 'videoCollaborators'
            ])
        },
        components: {
            'my-header': MyHeader,
            'my-footer': MyFooter,
            'canon-statistics': CanonStatistics,
            'video-assignments': VideoAssignments,
        }
    }
</script>

<style>
/* ==============================================
                #GENERIC
================================================= */

.Invention { background-color: #15314F;}
.Structure { background-color: #F2992E; }
.Delivery { background-color: #39A0ED; }
.Visuals { background-color: #717C89; }
.Style { background-color: #38C97C; }

.Invention-border { border-left: 12px solid #15314F;}
.Structure-border { border-left: 12px solid #F2992E; }
.Delivery-border { border-left: 12px solid #39A0ED; }
.Visuals-border { border-left: 12px solid #717C89; }
.Style-border { border-left: 12px solid #38C97C; }

.Invention-border-triangle { border-top-color: #15314F;}
.Structure-border-triangle { border-top-color: #F2992E; }
.Delivery-border-triangle { border-top-color: #39A0ED; }
.Visuals-border-triangle { border-top-color: #717C89; }
.Style-border-triangle { border-top-color: #38C97C; }

.video__body {
    margin: 5px 15px 15px 15px;
}


/* ==============================================
                #VIDEO-BREADCRUMB
================================================= */

.video__breadcrumb {
    height: 60px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
}

    .video__breadcrumb-title {
        /*width: 72%;*/
    }

        .video__breadcrumb-title-btn  {
            transition: background-color 0.5s ease;
            color: #39425C !important;
            padding: 10px !important;
            height: 100% !important;
            background-color: none !important;
        }
        .video__breadcrumb-title-btn:hover {
            background-color: #A90931 !important;
            color: #FFFFFF !important;
        }

        .video-timer {
            /*width: 28%;*/
            height: 50px;
            font-size: 2em;
            text-align: center;
            color: #39425C;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }


/* ==============================================
                #ADD ANNOTATION AREA
================================================= */

.add-annotation-area {
    cursor: pointer;
    height: 100px;
    color: #39425C;
    border: 0.1em solid #39425C;
    border-top: none;
    background: #FFF;
    transition: 0.25s;
    -webkit-transition: 0.25s;
    display: flex;
    justify-content: center;
    align-items: center;
}
.add-annotation-area:hover {
    color: #FFF;
    background: #39425C;
}

    .add-annotation-area span {
        margin: 10px;    
        font-size: 1.4em;
    }





/* ==============================================
                #COLLABORATORS
================================================= */
.collaborators {
    margin-top: 15px;
}

    .collaborators span {
        margin-left: 5px;
    }




/* ==============================================
                #PROGRESS BAR
================================================= */

    .player {
        width: 100%;
    }

    .videoline {
        position: relative;
        height: 80px;
        border-radius: 0;
        background-color: #39425C;
        border-bottom: 1px solid #27314d;
        display: flex;
    }
    .videoline__now-time {
        color: #fff;
        margin-top: 10px;
    }

        .videoline-ribbon {
            /*display: none !important;*/
            position: absolute;
            height: 130px;
            left: 0;
            margin: 0;
            margin-top: 0px;
            padding: 0;
            cursor: pointer;
            z-index: 150;
            display: flex;
            flex-direction: column;
            align-self: center;
        }
            .videoline-ribbon-circle {
                width: 20px;
                height: 20px;
                border-radius: 50%; /*1px;*/
                border: 3px solid #FFF;
                background-color: #C53B3B;
                display: flex;
                justify-content: center;
            }
            .videoline-ribbon-line {
                width: 1px;
                height: 100%;
                background-color: #fff;
                margin-left: 0;
                align-self: center;
            }
                .videoline-ribbon-line-time {
                    color: #FFF;
                    font-size: 0.6em;
                    margin: -4px 0px 0px 10px;
                }

/*------------------------------------*\
  #DRAG N' DROP CROP
\*------------------------------------*/

.videoline-crop {
    height: 50%;
    /*position: relative;
    border-radius: 0;
    background-color: #39425C;
    display: flex;
    border-bottom: 1px solid #FFF;*/
}
    .crop__corner {
        width: 0px;
        margin: 0;
        padding: 0px 0px; /* Applying Fitt's Law */
        height: 90%; /* of 100px */
        /*margin-top: 20px;*/
        background-color: #F2C94C;
        cursor: col-resize;
        position: absolute;
        border-radius: 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: center;
    }

        .crop__corner span {
            height: 100%;
            display: flex;
            align-items: center;
        }

        .crop__grab {
            padding: 1px;
            padding: 18px 1px;
            border-radius: 0px;
            background-color: #F2C94C;
        }
        .crop__time-label {
            z-index: 200;
            padding: 2px 5px;
            font-size: 9px;
            font-weight: 700;
            color: rgb(25, 30, 42);
            background: #F2C94C;
            border-radius: 15px;
        }

            .crop__start .crop__time-label { 
                margin-left: -50px;
            }
            .crop__end .crop__time-label { 
                margin-left: 50px;
            }
        

    .crop__space {
        z-index: 90;
        /* margin-top: 20px;*/
        position: absolute;
        border-radius: 0px;
        border: 1px solid #F2C94C;
        height: 100%; /* of 100px */
        background-color: #7A7F8D;
    }

    .crop__start {
        z-index: 105;
        
    }
        .crop__start span:nth-child(1) {
            padding: 5px 5px; 
            background-color: #F2C94C; 
        }

    .crop__end {
        z-index: 100;
    }
        .crop__end span {
            padding: 5px 5px; 
            background-color: #F2C94C; 
        }

    .times {
        height: 30px;
        background-color: #39425C;
        display: flex;
        border-top: 1px solid #27314d;
        justify-content: space-between;
        align-items: flex-end;
    }
        .times-min {
            width: 1px;
            height: 70%;
            font-size: 9px;
            color: #ccc7c7; /*  rgb(25, 30, 42)*/
            border-right: 1px solid #FFF;
        }
        /*.times-sec {
            width: 1px;
            height: 40%;
            font-size: 7px;
            color: #FFF;
            background-color: #FFF;
            border-right: 1px solid #FFF;
        } */

.videoline-progress {
    /*z-index: 95;*/
    height: 100%;
    position: absolute;
    background-color: rgba(45, 54, 79, 0.67);
}

/* ==============================================
                #ANNOTATE FIELDS
================================================= */
        
    .annotate-btn {
      padding: 7px;
      cursor: pointer;
      pointer-events: all;
      color: #fff;
      background-color: #39425C;
      display: flex;
      justify-content: flex-end;
    }

    .annotate-menu__canons {
        background-color:#39425C;
        display: flex;
        justify-content: center;
    }

        .annotate-menu__canons a {
            color: #FFF;
            padding: 5px 15px;
            font-size: 1.4em;
            border-top: 1px solid #27314D;
            border-right: 1px solid #27314D;
        }
        .annotate-menu__canons a:hover {
            opacity: 0.75;
        }

        .annotate-menu__canons-close {
            flex-grow: 1;
            display: flex;
            justify-content: flex-end;
        }
            .annotate-menu__canons-close span {
                width: 50px;
                color: #FFF;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .annotate-menu__canons-close span:hover {
                color: #39425C;
                background-color: #FFF;
            }

    .annotate-menu__categories {
        width: 100%;
        background-color: #39425C;
        display: flex;
    }
        .annotate-menu__categories a {
            width: 25%;
            height: 100px;
            color: #FFF;
            border: 1px solid #27314D;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .annotate-menu__categories a:hover {
            opacity: 0.75;
        }

    .annotate-menu__subcategories {
        width: 100%;
        background-color: #39425C;
        display: flex;
    }
        .annotate-menu__subcategories a {
            width: 25%;
            height: 100px;
            color: #FFF;
            border: 1px solid #27314D;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .annotate-menu__subcategories a:hover {
            opacity: 0.75;
        }

        .annotate-menu__subcategories button {
            background-color: #39425C;
            color: #FFF !important;
            border: none;
        }


            .el-slider { width: 80%}
            .el-slider__bar, .el-slider__button-wrapper, .el-slider__stop { height: 40px !important; }
            .el-slider__button { width: 25px; height: 25px; }
            .el-slider__stop { border-radius: 0 !important;}

            .el-slider__runway { height: 40px !important;}


    .annotate-fields {
        padding: 5px;
        display: flex;
        background-color: #39425C;
    }
    
    .annotate-fields p,
    .annotate-fields label {
        color: #fff;
    }

        .annotate-fields-left {
            width: 10%;
        }
            .annotate-fields-left-back {
                color: #FFF;
                border: none;
                background-color: #39425C;
            }

            .annotate-fields-left-back:hover {
                color: #27314D;
            }

                .annotate-fields-left-back i {
                    padding-right: 3px;
                }

        .annotate-fields-right {
            width: 90%;
        }
            .annotate-desc {
                display: flex ;
                justify-content: center;
            }

            .annotate-desc-text {
                margin-left: 60px;
                color: #FFF;
            }
                .annotate-desc-text h1{
                    font-size: 1.3em;
                    text-transform: uppercase;
                }
                .annotate-desc-text p{
                    font-style: italic;
                }

                .annotate-desc-text__wiki {
                    color: #fff;
                    margin-left: 10px;
                }
                    .annotate-desc-text__wiki i {
                        margin-right: 2px;
                    }

            .annotate-effectiveness {
                display: flex;
                flex-direction: column;
                padding: 0;
                margin: 0;
            }
                .annotate-effectiveness label {
                    padding: 0;
                    margin: 0;
                }
            
            .annotate-comment {
                display: flex;
                flex-direction: column;
                margin-bottom: 10px;
            }
                .annotate-comment label {
                    width: 15%;
                }
                .annotate-comment p {
                    width: 80%;
                }
                .annotate-comment textarea {
                }

            .annotate-drag {
                display: flex;
                justify-content: space-between;
                padding-left: 115px;
            }
                .annotate-drag-inputs {
                    display: flex;
                }
                    .annotate-drag-inputs input {
                        width: 100px;
                        margin-right: 5px;
                    }

                .annotate-submit {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                    .annotate-submit button {
                        height: 100%;
                        padding: 15px;
                    }


/* ==============================================
                    #CARDS
================================================= */

.cards {
}   

    .card-menu {
        height: 50px;
        display: flex; /*  none*/
        justify-content: center;
        width: 100%;
        margin-bottom: 10px;
    }

        .card-menu__item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #FFF;
        }
        .card-menu__item:hover {
            color: white;
        }
             .card-menu__title {
                 font-size: 14px;
            }

            .card-menu__triangle {
                content: '';
                border-color: none transparent transparent transparent; /* The top border color is setted dynamically. */
                border-style: solid;
                border-width: 20px 40px 0 40px;
                height: 0px;
                width: 0px;
                position: relative;
                top: 5px;
            }

        .add-annotation {
            color: #4A4A4A !important;
            background-color: #FFF !important;
        }

    .timeline-container {
        height: 37.76vw;
        overflow-y: scroll;
        margin-top: 20px;
    }

        .timeline {
            height:100%;
            width: 100%;
            overflow: auto;
            padding: 15px !important;
        }
            .timeline-card {
                background: none;
                margin-bottom: 10px;
                box-shadow: 0 3px 6px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.24);  
                z-index: 100;              
            }

            .timeline-card:hover {
                opacity: 0.9;
                transition: 0.8;
            }

                .timeline-card__head {
                    cursor: pointer;
                }
                    .timeline-card__title-container {
                        display: flex;
                        justify-content: space-between;
                    }
                    
                    .timeline-card__title {
                        font-size: 1.2em;
                        font-style: bold;
                        text-transform: uppercase;
                    }
                    .timeline-card__time {
                        font-size: 0.8em;
                    }
                    .timeline-card__desc {
                        margin-top: 2px;
                        font-size: 0.8em;
                        line-height: 1.4em;
                    }

                .timeline-card__body {
                    margin-top: 5px;   
                }
                    .timeline-card__body-title {
                        font-size: 12px; 
                        display: flex;
                    }

                    .timeline-card__comment {
                        font-size: 0.8em;
                        line-height: 1.3em;
                    }
                        .timeline-card__comment span {
                            margin: 15px;
                        }

                    #readmore {
                        color: #38425d;
                        font-weight: bold;
                        float: right;
                    }

                .timeline-card__footer {
                    margin-top: -20px;
                    display: flex;
                    justify-content: flex-end;
                    cursor: pointer;
                }

                    .timeline-card__effectiveness {
                        display: flex;
                        align-items: center;
                    }

                        /* NEW */
                        .timeline-card__progress {
                            width: 60%;
                            height: 12px;
                            background-color: #d8dcdb;
                            border-radius: 3px;
                            display: flex;
                        }
                            .timeline-card__progressSpan {
                                height: 12px;
                                border-radius: 3px;
                            }
                        /* /NEW */

                        .timeline-card__effectiveness progress {
                            width: 75%;
                            margin-top: 5px;
                        }
                        .timeline-card__effectiveness progress::-webkit-progress-value { 
                            background-color: #89A9C0 !important; /*#38425d*/
                        }

                        .timeline-card__effectiveness-label {
                            width: 25%;
                            text-align: right;
                            font-size: 0.8em;
                        }
                    .timeline-card__author {
                        opacity: 0.7;
                        font-size: 0.8em;
                        margin-top: 5px;
                        display: flex;
                        align-self: flex-end;
                    }

                    .timeline-card__id {
                        visibility: hidden;
                        font-size: 0.4em;
                    }

                    .timeline-card__edit-container {
                        display: flex;
                        flex-direction: column;
                    }


                    .edit-buttons {
                        display: none;
                        justify-content: center;
                        align-items: center;
                        color: #FFFFFF;
                    }
                        .edit-buttons-moreLess {
                            height: 25px;
                            width: 32px;
                        }
                        .edit-buttons-moreLess:hover {
                            background-color: #FFFFFF !important;
                            color: #6B6B6B !important;
                            box-shadow: inset 0 0 0 2px #6B6B6B;
                        }
                        .edit-buttons-edit {
                            background-color: #159D1A;
                            opacity:0.8;
                        }
                        .edit-buttons-edit:hover {
                            background-color: #FFFFFF !important;
                            color: #003300 !important;
                            box-shadow: inset 0 0 0 3px #003300;
                        }
                        .edit-buttons-delete {
                            background-color: #BC1715;
                        }
                        +.edit-buttons-delete:hover {
                            background-color: #FFFFFF !important;
                            color: #A90931 !important;
                            box-shadow: inset 0 0 0 3px #A90931;
                        }


                    .timeline-card__edit-container button:hover {
                        color: #FFF;
                        background-color: #272424;
                    }





/* ==============================================
    #VIDEO-ERROR-HANDLING CARD
================================================= */
    .errorhandling {
        background: none;
        margin-bottom: 10px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.24);  
        z-index: 100; 
        padding-bottom: 30px;     
    }

    .errorhandling:hover {
        opacity: 0.9;
        transition: 0.8;
    }

        .errorhandling__head {
            cursor: pointer;
        }
            .errorhandling__title-container {
                display: flex;
                justify-content: space-between;
            }
            
            .errorhandling__title {
                font-size: 1.2em;
                font-style: bold;
                text-transform: uppercase;
            }
            .errorhandling__time {
                font-size: 0.8em;
            }
            .errorhandling__desc {
                margin-top: 2px;
                font-size: 0.8em;
                line-height: 1.4em;
            }

        .errorhandling__body {
            margin-top: 5px;   
        }
            .errorhandling__body-title {
                font-size: 12px; 
                display: flex;
            }

            .errorhandling__comment {
                font-size: 0.8em;
                line-height: 1.3em;
            }
                .errorhandling__comment span {
                    margin: 15px;
                }

            #readmore {
                color: #38425d;
                font-weight: bold;
                float: right;
            }

        .errorhandling__footer {
            margin-top: -20px;
            display: flex;
            justify-content: flex-end;
            cursor: pointer;
        }



/* ==============================================
        #MT-TABLE
================================================= */

.mt-table li {
	padding: 5px 5px;
	border-bottom: 1px solid #ccc;
	list-style: none;
}
.mt-table li:hover {
	background-color: #F5F5F5;
}

	.mt-table__row {
		display: flex;
    	justify-content: space-between;
	}





/* ==============================================
                #OVERLAY STUFF
================================================= */
.more-annotations {
    position: fixed; 
    right:20px; 
    bottom:50px; 
    display:none; 
    flex-direction:column; 
    align-items:center; 
    font-weight: 600;
    color: #6B6B6B;
}

    .scroll-mouse {
        border: 1px solid;
        border-color: #6B6B6B;
        padding-left: 7px;
        padding-right: 7px;
        padding-top: 2px;
        padding-bottom: 10px;
        border-radius: 15px;
    }

    .scroll-wheel {
        position: relative;
        font-size: 8px;
        -webkit-animation-name: example; /* Safari 4.0 - 8.0 */
        -webkit-animation-duration: 2s; /* Safari 4.0 - 8.0 */
        -webkit-animation-iteration-count: infinite; /* Safari 4.0 - 8.0 */
        animation-name: example;
        animation-duration: 2s;
        animation-iteration-count: infinite;
    }

    /* Safari 4.0 - 8.0 */
    @-webkit-keyframes example {
        0%   {left:0px; top:0px;}
        50%  {left:0px; top:8px;}
        100% {left:0px; top:0px;}
    }

    /* Standard syntax */
    @keyframes example {
        0%   {left:0px; top:0px;}
        50%  {left:0px; top:8px;}
        100% {left:0px; top:0px;}
    }


/* ==============================================
                #JWPLAYER TRUMPS
================================================= */

.jw-controlbar {
    /*display: none !important;*/
}

.jw-controlbar-center-group .jw-slider-time, 
.jw-controlbar-center-group .jw-slider-container, 
.jw-controlbar-center-group .jw-rail,
.jw-controlbar-center-group .jw-slider-horizontal .jw-progress,
.jw-controlbar-center-group .jw-buffer {
    height: 100% !important;
}

.jw-controlbar-center-group .jw-knob {
    background-color: #313A53;
    border: 0.12em solid #fff;
    font-size: 3em;
    top: 10%;
}

.jw-dock {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-end !important;
    justify-content: flex-end !important;
    height: 100%;
    width: 100%;
    margin: 0px !important;
    padding: 0px !important;
}

    .jw-dock-button {
        display: flex !important;
        margin: 35px !important;
        font-size: 3.5em;
    }


.jw-nextup-container {
    opacity: 1 !important;
    visibility: visible !important;
    padding: 0;
    margin: 0;
}
    .jw-nextup { display: none !important; }


.jw-background-color { background-color: #313A53 !important }

#player .jw-option.jw-active-option, #player .jw-progress { background-color: #27314d !important } 

.jw-buffer { background-color: #313A53 !important }

.jw-rail { background-color: #39425C !important }


/* ==============================================
                #TRUMPS
================================================= */

.fa_1_5x {
    font-size: 1.5em;
}

.progress.is-info {
    background-color: #313A53 !important; 
}

.el-rate__icon {
    font-size: 26px;
}

.el-checkbox-group {
    display: flex !important;
    flex-direction: column !important;
}

.el-checkbox+.el-checkbox { 
    margin-left: 0 !important; 
}

.el-select {
    display: flex !important;
    width: 80%;
}

.uploadvid__sync .el-loading-text {
    font-size: 1.5em;
}

.uploadvid__sync .uploadvid__sync-load {
    padding: 10em 0 5em 0;        
}

</style>