<template>

		<aside class="sidebar column is-2 aside">

			<!-- Sidebar buttons/actions  -->
			<div class="sidebar__actions" v-if="!loadingClasses">
				<a class="sidebar__actionsLink" @click="createNewClassModalOpen();"><i class="fa fa-plus"></i>Create new class</a>
				<a class="sidebar__actionsLink" @click="modalInviteUserIsOpen = true"><i class="fa fa-plus"></i>Invite a new user</a>
				<a class="sidebar__actionsLink" v-if="currentClass.name !== 'Home'" @click="modalDeleteClassIsOpen = true"><i class="fa fa-trash"></i>Delete this class</a>
				<a class="sidebar__actionsLink" v-if="!(currentClass.name === 'Home')" @click="openAssignmentsModal()"><i class="fa fa-file-text-o"></i>Assignments<span class="dot" v-if="!!assignmentsBadgeOn && assignments.length === 0"></span></a>
				<a class="sidebar__actionsLink" v-if="!(currentClass.name === 'Home')" @click="modalArchiveClassIsOpen = true"><i class="fa fa-archive"></i>Archive this class</a>
				<a class="sidebar__actionsLink" v-if="!(currentClass.name === 'Home')" @click="toggleModalStudentRequests()"><i class="fa fa-file-text-o"></i>Student requests ({{ requestedStudents.length }})</a>
				<a class="sidebar__actionsLink" v-if="!(currentClass.name === 'Home')" @click="editCategoriesModalOpen()"><i class="fa fa-commenting-o"></i>Edit categories</a>
			</div>

			<!-- Sidebar Classes menu for administrator-->
			<div class="sidebar__classes">
				<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingClasses" 
					v-if="loadingClasses"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
				<el-tabs v-model="sidebarClassesTab" v-show="!loadingClasses">
					<el-tab-pane label="Active classes" name="activeClasses">
						<div class="sidebar__classes">
							<i v-if="adminActiveClasses.length === 0"> &nbsp;&nbsp; No classes </i>
							<el-input class="sidebar__classesInput" v-if="adminActiveClasses.length !== 0" icon="search" v-model="searchInputActiveClassSidebar" @change="filterClassArray('adminActiveClasses', 'filteredAdminActiveClasses', searchInputActiveClassSidebar)" placeholder="Search for a class..."></el-input>
							<a class="sidebar__classesLink" v-for="c in filteredAdminActiveClasses"  :class="{ 'is-bg-light' : (currentClass.name === c.name) }" :key="c.id" @click="setCurrentClass(c)">{{ c.number }} - {{ c.name }}</a>
						</div>
					</el-tab-pane>
					<el-tab-pane label="Archived" name="archivedClasses">
						<div class="sidebar__classes">
							<i v-if="adminArchivedClasses.length === 0"> &nbsp;&nbsp; No archived classes </i>
							<el-input class="sidebar__classesInput" v-if="adminArchivedClasses.length !== 0" icon="search" v-model="searchInputArchivedClassSidebar" @change="filterClassArray('adminArchivedClasses', 'filteredAdminArchivedClasses', searchInputArchivedClassSidebar)" placeholder="Search archived classes..."></el-input>							
							<a class="sidebar__classesLink" v-for="c in filteredAdminArchivedClasses" :key="c.id" :class="{ 'is-bg-light' : (currentClass.name === c.name) }" @click="openModalUnarchiveClass(c.id)">{{ c.number }} - {{ c.name }}</a>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
			

			<!-- administrator -->
			<el-dialog title="Add new class" :visible.sync="modalCreateClassIsOpen" :before-close="handleNewClassClose">
				
				<el-steps :active="createModalActive" finish-status="success" space="97%"> <!-- TODO change space to some function of the width of the modal -->
					<el-step></el-step>
					<el-step></el-step>
				</el-steps>

				<!-- First Step -->
				<el-form :model="newClass" v-if="createModalActive == 0">
					<el-form-item label="Name">
						<el-input v-model="newClass.name" placeholder="Advanced Essay Workshop" required></el-input>
					</el-form-item>
					<el-form-item label="Department">
						<el-input v-model="newClass.department" placeholder="Comparative Media Studies / Writing" required></el-input>
						<!-- <el-select  placeholder="Choose a department" >
							<el-option v-model="newClass.department" :label="c.department" :value="c.department" v-for="c in classes" v-bind:key="c.title"></el-option>
						</el-select> -->
					</el-form-item>
					<el-form-item label="Number">
						<el-input v-model="newClass.number" placeholder="21W.745" required></el-input>
					</el-form-item>
					<el-form-item label="Semester">
						<el-input v-model="newClass.semester" placeholder="Spring 2018" required></el-input>
					</el-form-item>
				</el-form>
				<!-- /First Step -->

				<!-- Second Step -->
				<div v-if="createModalActive == 1">
					<h3 style="margin-bottom:10px;">Choose genre:</h3>
					<el-select v-model="currentGenre" placeholder="Choose a genre" style="width:300px" @change="handleGenreSelection()">
						<el-option v-for="g in genres" :key="g.name" :label="g.name" :value="g.name"></el-option>
					</el-select>
					<br>
					<!-- <el-button v-if="currentGenre !== ''" style="margin-top:10px" @click="modalAddCategoryIsOpen = true"> Add category</el-button> -->
					<!-- <el-radio class="radio" v-model="currentGenre" v-for="g in genres" :key="g.name" :label="g.name"></el-radio> -->
					<br>
					<br>
					<div v-if="currentGenre">
						<p>Choose canons:</p>
						<el-tree :data="elementTreeForm" :props="genreProps" show-checkbox ref='elementTreeRef' node-key='id'></el-tree>
					</div>
				</div>
				<!-- /Second Step -->

				<span slot="footer" class="dialog-footer">
					<el-button v-if="createModalActive == 0" style="float:left;" @click="handleNewClassClose()">Cancel</el-button>
					<el-button v-if="createModalActive == 0" class="add-class-btn" @click="nextStep()">Next Step</el-button>

					<el-button v-if="createModalActive == 1" style="float:left;" @click="previousStep()">Previous Step</el-button>
					<el-button v-if="createModalActive == 1" class="add-class-btn" @click="createClass()">Create Class</el-button>
				</span>
			</el-dialog>


			<el-dialog title="Categories customization" :visible.sync="modalGenreCustomization" size="large" :before-close="handleEditCategoriesClose">
				<h3 style="margin-bottom:10px;">Choose genre:</h3>
				<el-select v-model="currentGenre" placeholder="Choose a genre" style="width:300px" @change="handleGenreSelection()">
					<el-option v-for="g in genres" :key="g.name" :label="g.name" :value="g.name"></el-option>
				</el-select>
				<br>
				<!-- <el-button v-if="currentGenre !== ''" style="margin-top:10px" @click="modalAddCategoryIsOpen = true"> Add category</el-button> -->
				<!-- <el-radio class="radio" v-model="currentGenre" v-for="g in genres" :key="g.name" :label="g.name"></el-radio> -->
				<br>
				<br>
				<div v-if="currentGenre">
					<p>Choose canons:</p>
					<el-tree :data="elementTreeForm" :props="genreProps" show-checkbox ref='elementTreeRef' node-key='id'></el-tree>
				</div>
				
				<span slot="footer" class="dialog-footer">
						<el-button @click="handleEditCategoriesClose()">Cancel</el-button>
						<el-button @click="saveNewCustomCategories()">Save</el-button>
				</span>
			</el-dialog>

			<!-- <el-dialog title="Add category" :visible.sync="modalAddCategoryIsOpen" size="small">
					<el-select style="margin-bottom:10px;" v-model="newCategoryCanon" placeholder="Choose a canon">
						<el-option v-for="c in canons" :key="c.label" :label="c.label" :value="c.label"></el-option>
					</el-select>
					<el-input style="margin-bottom:10px;" placeholder="Category name" v-model="newCategoryName"></el-input>
					<el-input
						type="textarea"
						:rows="2"
						placeholder="Category description"
						v-model="newCategoryDesc">
					</el-input>
					<span slot="footer" class="dialog-footer">
							<el-button @click="modalAddCategoryIsOpen = false; addNewCategory()">Add</el-button>
					</span>
			</el-dialog>	 -->

			<el-dialog :title="'Do you want to archive `' + currentClass.name + '` class?'" :visible.sync="modalArchiveClassIsOpen">
				<el-button @click="modalArchiveClassIsOpen = false">Go back</el-button>
				<el-button class="add-class-btn" @click="archiveClass()"><strong>Archive Class</strong></el-button>
			</el-dialog>

			<el-dialog :title="'Do you want to unarchive this class?'" :visible.sync="modalUnarchiveClassIsOpen">
				<el-button @click="modalUnarchiveClassIsOpen = false">Go back</el-button>
				<el-button class="add-class-btn" @click="unArchiveClass()"><strong>Unarchive Class</strong></el-button>
			</el-dialog>		

			<!-- administrator -->
			<el-dialog :title="'Do you want to delete `' + currentClass.name + '` class?'" :visible.sync="modalDeleteClassIsOpen">
				<el-button @click="modalDeleteClassIsOpen = false">Go back</el-button>
				<el-button class="add-class-btn" @click="deleteClass()"><strong>Delete Class</strong></el-button>
			</el-dialog>

			<!-- administrator - invite new user -->
			<el-dialog title="Invite a new user" :visible.sync="modalInviteUserIsOpen">
					<el-form :model="invitation">
							<el-form-item label="Email">
								<el-input v-model="invitation.email" placeholder="E-mail address"></el-input>
							</el-form-item>
							<el-form-item>
								<el-input v-model="repeatEmail" placeholder="Repeat e-mail address"></el-input>
							</el-form-item>
							<el-form-item label="Role">
								<br>
								<el-select v-model="invitation.role" placeholder="Choose a role" >
									<el-option v-for="r in roles" :key="r.value" :label="r.label" :value="r.value" ></el-option>
								</el-select>
							</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer">
							<el-button @click="modalInviteUserIsOpen = false">Cancel</el-button>
							<el-button class="add-class-btn" @click="createInvitation()">Create Invitation</el-button>
					</span>
			</el-dialog>

			<!-- Administrator - Assignments -->
			<el-dialog v-bind:title="this.currentClass.name + ' Class assignments'" :visible.sync="modalClassAssignmentsIsOpen" class="modal-class-assignments" v-if="!!currentClass.id ">
				<!-- Loading Screen -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingAssignments" 
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"></div>
                <el-tabs v-show="!loadingAssignments">
					
					<el-dialog 
						:visible.sync="startingAssignmentMessageVisible"
						title="Create a starting assignment."
						append-to-body>
					</el-dialog>
					
                    <el-tab-pane v-for="a in assignments" :key="a.id" :label="a.title">
                		<el-tabs v-model="assignmentsModalSubtab" v-if="!loadingAssignments">
							<el-tab-pane label="General" name="General">
								<div class="assignments-content">
									<span class="assignments__title">
										<strong>Title:</strong>
										<span class="assignments__titleId">{{ a.id }}</span>
										<!-- Editing functionality for admin/professor -->
										<p class="assignments__titleText" @click="toggleTitleEdit($event)">{{ a.title }}</p>
										<textarea class="input assignments__titleInput" v-model="a.title" @blur="saveTitleEdit($event, a.id)" type="text"></textarea>
									</span>
									<hr>
									<span class="assignments__desc">
										<strong class="assignments__descTitle">Description:</strong>
										<span class="assignments__descId">{{ a.id }}</span>
										<!-- Editing functionality for admin/professor -->
										<p class="assignments__descText" @click="toggleDescriptionEdit($event)">{{ a.description }}</p>
										<textarea class="textarea assignments__descTextarea" v-model="a.description" @blur="saveDescriptionEdit($event, a.id)" type="text"></textarea>
									</span>
									<hr>
									<span class="assignments__genre" v-for="g in genres" v-if="g.id === a.genre" :key="g.id">
										<strong class="assignments__genreTitle">Genre:</strong> 
										<span class="assignments__genreId">{{ a.id }}</span>
										<!-- Editing functionality for admin/professor -->
										<p class="assignments__genreName" @click="toggleGenreEdit($event)">{{ g.name }}</p>
										<select class="assignments__genreSelect select" v-model="a.genre" @change="saveGenreEdit($event, a.id)">
											<option v-for="g in genres" :label="g.name" :value="g.id" :key="g.id" class="option"></option>
										</select>
									</span>
									<hr>
									<span class="assignments__dueDate">
										<strong class="assignments__dueDateTitle">Due date:</strong>
										<span class="assignments__dueDateId">{{ a.id }}</span>
										<p>
											<!-- Editing functionality for admin/professor -->
											<el-date-picker type="date" placeholder="Pick a date" v-model="a.dueDate" @change="saveDueDateEdit($event, a.id)"></el-date-picker>
										</p>
									</span>
								</div>
							</el-tab-pane>
							<el-tab-pane label="Class Submissions" name="ClassSubmissions">
								<mt-video-itemlist v-for="v in videos" v-bind:key="v.id" :currentVideo="v" v-if="v.assignmentId === a.id" :enableStatistics="false"></mt-video-itemlist>
							</el-tab-pane>
                		</el-tabs>
						
                    </el-tab-pane>
					<el-tab-pane label="+ Add assignment">
						<el-input v-model="assignmentTitle" placeholder="Set a title" style="width:70%;margin-bottom:15px;"></el-input>
						<el-input v-model="assignmentDescription" placeholder="Set a description" type="textarea" style="width:70%;margin-bottom:15px;"></el-input>
						<p>Choose genre:</p>
						<el-select v-model="assignmentGenre" placeholder="Select a genre" style="width:50%" @change="updateAssignments()">
							<el-option v-for="g in genres" :key="g.name" :label="g.name" :value="g.id"></el-option>
						</el-select>
						<p>Set due date:</p>
						<el-date-picker type="date" placeholder="Pick a date" v-model="assignmentDueDate"></el-date-picker>
						<hr>
						<el-button @click="createAssignment()">Create</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-dialog>

	
			<!-- Administrator - Student requests -->
			<el-dialog :visible.sync="modalStudentRequestsIsOpen">
				<span class="modal-student-requests" slot="title"><b><i class="fa fa-book"></i> {{currentClass.name}} - Enrollments</b></span>
				<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingModalStudents" 
					v-if="loadingModalStudents"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
                <el-tabs v-model="modalStudentRequestsTab" v-if="!loadingModalStudents">
                    <el-tab-pane label="Enrolled students" name="enrolledStudents">
						<p v-if="enrolledStudents.length === 0" ><i>No enrolled students</i></p>
                        <el-input icon="search" v-if="enrolledStudents.length !== 0" v-model="searchInput" @change="filterStudentsArray('enrolledStudents', 'filteredEnrolledStudents', searchInput)" placeholder="Search for a student..." style="width:220px;margin-bottom:7px;" class="mt-search-input"></el-input>
						<div class="mt-table">
							<li v-for="(s, index) in filteredEnrolledStudents" :key="s.id" style="list-style:none">
								<span><i class="fa fa-user"></i> {{ s.firstName + " " + s.lastName}}</span>
								<el-button size="small" type="info" @click="deleteEnrollment(index, s)" style="float: right; margin: -2px;">Unenroll</el-button>
							</li>
						</div>
                    </el-tab-pane>
                    <el-tab-pane name="requestedStudents">
						<p v-if="requestedStudents.length === 0" ><i>No enrollment requests</i></p>
    					<span slot="label">Enrollment requests ({{requestedStudents.length}})</span>
                        <el-input icon="search" v-if="requestedStudents.length !== 0" v-model="searchInput" @change="filterStudentsArray('requestedStudents', 'filteredRequestedStudents', searchInput)" placeholder="Search for a student..." style="width:220px;margin-bottom:7px;"></el-input>
						<div class="mt-table">
							<li v-for="(s, index) in filteredRequestedStudents" :key="s.id" style="list-style:none">
								<span><i class="fa fa-user"></i> {{ s.firstName + " " + s.lastName}}</span>
								<el-button size="small" type="info" @click="deleteRequest(index, s)" style="float: right; margin:-2px;">Delete request</el-button>
								<el-button size="small" type="info" @click="acceptStudent(index, s)" style="float: right; margin: -2px; margin-right: 5px">Accept request</el-button>
							</li>
						</div>
                        <el-button v-if="requestedStudents.length !== 0" sfize="small" type="info" @click="acceptAllStudents()" style="margin-top: 5px;">Accept all requests</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="Other students" name="otherStudents">
						<p v-if="otherStudents.length === 0" ><i>No other students</i></p>
                        <el-input icon="search" v-if="otherStudents.length !== 0" v-model="searchInput" @change="filterStudentsArray('otherStudents', 'filteredOtherStudents', searchInput)" placeholder="Search for a student..." style="width:220px;margin-bottom:7px;"></el-input>
						<div class="mt-table">
							<li v-for="(s, index) in filteredOtherStudents" :key="s.id" style="list-style:none">
								<span><i class="fa fa-user"></i> {{ s.firstName + " " + s.lastName}}</span>
								<el-button size="small" type="info" style="float: right; margin: -2px;" @click="enrollStudent(index, s)">Enroll student</el-button>
							</li>
						</div>
                    </el-tab-pane>
                </el-tabs>
            </el-dialog>
		</aside>

</template>

<script>
	import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
	import _ from 'lodash'
	import MtVideoItemList from '../Shared/MtVideoItemList.vue'
    
    export default {
		props: [],
		data() {
			return {
				// GENERAL
				userId: this.$root.$options.authService.getAuthData().userId,
				secureHTTPService : this.$root.$options.secureHTTPService,
				loadingClasses: false,
				loadingModalClasses: false,
				loadingModalStudents: false,
				loadingAssignments: false,
				// CLASSES
				sidebarClassesTab: 'activeClasses',  // Required to select a tab. activeClasses is the initialization
				searchInput: '',                     // General search variable used in search text areas
				searchInputActiveClassSidebar: '',   // General search variable used in search text areas
				searchInputArchivedClassSidebar: '', // General search variable used in search text areas
				searchInputClassModal: '',           // Used in search text area in find a class to enroll modal
				searchInputClassSidebar: '',         // Used in search text area in sidebar classes
				classIdClicked: '',
				// Administrator classes
				adminActiveClasses: [],         // All not archived classes of metalogon
				filteredAdminActiveClasses: [], 
				adminArchivedClasses: [],
				filteredAdminArchivedClasses: [],

				// MODALS
				modalClassAssignmentsIsOpen: false,
				videosWithoutUserSubs: [], // List of all class videos for current assignment
				// Administrator
				modalCreateClassIsOpen: false,
				createModalActive: 0,
				modalArchiveClassIsOpen: false,
				modalUnarchiveClassIsOpen: false,
				modalStudentRequestsIsOpen: false,
				// Administrator
				modalDeleteClassIsOpen: false,
				modalInviteUserIsOpen: false,

				// ENROLLMENTS
				// Administrator side
				modalStudentRequestsTab: 'enrolledStudents', // Required to select a tab. enrolledStudents is the initialization
				enrolledStudents: [],
                filteredEnrolledStudents: [],
				requestedStudents: [],
				filteredRequestedStudents: [],
				otherStudents: [],
				filteredOtherStudents: [],
				// ASSIGNMENTS
				assignmentsModalSubtab: 'General',
				assignmentSelectedId: '',
				assignmentTitle: '',
				assignmentDescription: '',
				assignmentGenre: '',
				assignmentCategorySelected: '',
				assignmentDueDate: '',
				categoriesCheckList: [],
				startingAssignmentMessageVisible: false,
				assignmentsBadgeOn: false,

				//-----------------------------------
				// Categories
				// categoriesGenre: '',
				currentGenre: '',
				previousGenre: '',
				firstTimeSelectingGenre: true,
				modalGenreCustomization: false,
				modalAddCategoryIsOpen: false,
				newCategoryCanon: "",
				newCategoryName: "",
				newCategoryDesc: "",
				// Categories customization
				selectedNodes: [], // Data structure that contains the selected categories ids for each genre
				elementTreeForm: [], // Data structure for the element library to read from
				genreProps: {
					children: 'children',
					label: 'label',
					desc: 'desc'
				},
				categoryProps: {
					children: 'children',
					label: 'label',
					desc: 'desc'
				},
				newClass: {
					archived: false,
					department: '',
					name: '',
					number: '',
					semester: '',
					catFilter: []
				},
				invitation: {
					"email": '',
					"role": ''
				},
				repeatEmail: '',
				roles: [
					{value: 'student', label: 'Student'},
					{value: 'professor', label: 'Professor'},
					{value: 'administrator', label: 'Administrator'}
				]
			}
		},
		mounted () {
			this.$store.dispatch('getCategories')
			// Initialize classes arrays
			this.loadingClasses = true
            var self = this
            self.updateAdminClasses() 
            .then(function() {
                self.loadingClasses = false
            })
		},
		methods: {
			handleGenreSelection() {
				// Saving previous genre tree
				if (this.firstTimeSelectingGenre) {
					this.previousGenre = this.currentGenre
					this.firstTimeSelectingGenre = false
				}
				else {
					// console.log("saved new custom tree with genre:", this.previousGenre)
					for(var g in this.selectedNodes) {
						if (this.selectedNodes[g].genreName === this.previousGenre) {
							var self = this
							new Promise(function () {
								self.selectedNodes[g].selectedNodes = self.$refs.elementTreeRef.getCheckedKeys(true)
							})
							break
						}
					}
				}
				// Set up new genre tree
				for(var g in this.selectedNodes) {
					if (this.selectedNodes[g].genreName === this.currentGenre) {
						var self = this
						new Promise(function () {
							// leaves only = false
							self.$refs.elementTreeRef.setCheckedKeys(self.selectedNodes[g].selectedNodes, false)
						})
						break
					}
				}
				
				// console.log("currentGenre: ", this.currentGenre, " - previous: ", this.previousGenre)
				// console.log(this.selectedNodes)
				this.previousGenre = this.currentGenre
				
			},
			createNewClassModalOpen() {
				// This function runs when the create class modal first opens
				// It updates canon tree, genres and categories and then
				// initializes the selectedNodes array which contains the edited
				// category trees for each genre with default tree

				var self = this
				// Update canon tree
				this.$store.dispatch('getCanons')
				.then(function() {
					// Get the default tree form from the /tree resource (this.canons)
					self.elementTreeForm = self.createElementTree(self.canons)
					return self.$store.dispatch('getGenres')
				})
				// Update categories
				.then(function() {
					return self.$store.dispatch('getCategories')
				}) 
				.then(function() {
					self.modalCreateClassIsOpen = true
					self.selectedNodes = []
					// Initialize one genre object for each genre in selected nodes
					// First get all leaf ids (categories id)
					// These are all the leaf nodes of the tree which are selected by default
					var defaultSelectedNodes = []
					for (var cat in self.categories) {
						try {
							defaultSelectedNodes.push(self.categories[cat].id)
						}
						catch (err) {
							console.log("createNewClassModalOpen err:", err)
						}
					}
					for (var g in self.genres) {
						self.selectedNodes.push({
							"genreId": self.genres[g].id,
							"genreName": self.genres[g].name,
							selectedNodes: defaultSelectedNodes
						})
					}
				})
			},
			editCategoriesModalOpen() {
				// This function runs when the edit categories modal first opens
				// It updates canon tree, genres and categories and then
				// initializes the selectedNodes array which contains the edited
				// category trees for each genre

				var self = this
				// Update canon tree
				this.$store.dispatch('getCanons')
				.then(function() {
					return self.$store.dispatch('getGenres')
				})
				// Update categories
				.then(function() {
					return self.$store.dispatch('getCategories')
				}) 
				.then(function() {
					self.modalGenreCustomization = true
					self.selectedNodes = []
					// Initialize one genre object for each genre in selected nodes
					for (var g = 0; g < self.currentClass.catFilter.length; g++) {
						self.selectedNodes.push({
							"genreId": self.genres[g].id,
							"genreName": self.genres[g].name,
							selectedNodes: self.currentClass.catFilter[g].selectedNodes
						})
					}
					// Get the default tree form from the /tree resource (this.canons)
					var customTree = self.createCustomCanonTree(self.selectedNodes[self.selectedNodes.length - 1].selectedNodes)
					self.elementTreeForm = self.createElementTree(customTree)
				})
			},
			nextStep() {
				if(this.newClass.department !== '' && this.newClass.name !== '' && this.newClass.number !== '' && this.newClass.semester !== ''){
					// Cycle
					// if(this.createModalActive++ > 2) {
					// 	this.createModalActive = 0;
					// } 
					this.createModalActive++
				}
				else {
					this.$message({
						showClose: true,
						message: 'Please fill out all the fields.',
						type: 'warning'
					});
				}
			},
			previousStep() {
				if(this.createModalActive-- <= 0) {
					this.createModalActive = 0;
				}
			},
			handleNewClassClose() { 
				// This function gets called when the create class modal closes
				// It resets all necessary variables and closes the modal

				//(done) {
				// this.$confirm('Are you sure to close this dialog?')
				// .then(_ => {
				// 	done();
				// })
				// .catch(_ => {});
				this.currentGenre = ''
				this.previousGenre = ''
				this.firstTimeSelectingGenre = true
				this.createModalActive = 0
				this.newClass = {
					archived: false,
					department: '',
					name: '',
					number: '',
					semester: '',
					catFilter: []
				}
				this.modalCreateClassIsOpen = false
			},
			handleEditCategoriesClose() { 
				// This function gets called when the edit categories modal closes
				// It resets all necessary variables and closes the modal

				//(done) {
				// this.$confirm('Are you sure to close this dialog?')
				// .then(_ => {
				// 	done();
				// })
				// .catch(_ => {});
				this.currentGenre = ''
				this.previousGenre = ''
				this.firstTimeSelectingGenre = true
				this.newClass = {
					archived: false,
					department: '',
					name: '',
					number: '',
					semester: '',
					catFilter: []
				}
				this.modalGenreCustomization = false
			},
            filterClassArray: _.debounce(function (arrayName, filteredArrayName, filterString) {
				// Filters any class array
				// Requires the array's name as string in the first argument and 
				// the filtered array's name as string in the second argument and
				// the search input in the third argument

                // Define the filter method
                var filterClasses = (queryString) => {
                    return (c) => {
						var classFullName = c.name + " " + c.number + " " + c.department + " " + c.semester
                        return classFullName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
                    }
				} 
				this[filteredArrayName] = this[arrayName].filter(filterClasses(filterString))
				
			}, 500),
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
			updateAdminClasses(){
				// This method updates the "admin classes", ie adminActiveClasses, adminArchivedClasses
				// It relies on the store's classes, which gets updated first.

				var self = this
				return this.$store.dispatch("getAllClasses") // Update state.classes
				.then(function() {
					self.adminActiveClasses = [] // All not archived classes of metalogon
					self.filteredAdminActiveClasses = [] 
					self.adminArchivedClasses = []
					self.filteredAdminArchivedClasses = []
					for (var c = 0; c < self.classes.length; c++) {
						if (self.classes[c].archived) {
							self.adminArchivedClasses.push(self.classes[c])
							self.filteredAdminArchivedClasses.push(self.classes[c])
						}
						else {
							self.adminActiveClasses.push(self.classes[c])
							self.filteredAdminActiveClasses.push(self.classes[c])
						}
					}
				})
			},
			// Administrator
			createInvitation() {
				if (this.invitation.email === '' || this.invitation.role === '') {
					this.$message({
						showClose: true,
						message: 'Please complete all the fields.',
						type: 'warning'
					});
				}
				else if (this.invitation.email != this.repeatEmail) {
					this.$message({
						showClose: true,
						message: 'Please repeat e-mail address correctly.',
						type: 'warning'
					});
				}
				else {
					var self = this
					this.secureHTTPService.post("invitation", this.invitation)
					.then(function (response) {
						// console.log(response)
						self.$message({
							showClose: true,
							message: 'Invitation code: ' + response.data.data.id,
							type: 'warning'
						});
					})
					.catch(function (err) {
						console.log("Error while posting invitation: ", err)
						self.$message({
							showClose: true,
							message: "Something went wrong.",
							type: 'warning'
						});
					})
					this.modalInviteUserIsOpen = false
					this.invitation = {"email": '', "role": ''} // Reset invitation
					this.repeatEmail = ''
				}
			},
			deleteClass() {
				var classId = this.currentClass.id

				var self = this
				// All associated enrollment resources must be deleted
				// Update this class's enrollments first
				this.$store.dispatch('getEnrollmentsByClassId', classId)
				.then(function() {
					return 
				})
				.then(function() {
					for (var e = 0; e < self.classEnrollments.length; e++) {
						self.$store.dispatch("deleteEnrollment", self.classEnrollments[e].id)
					}
					return
				})
				.then(function() {
					return self.$store.dispatch('deleteClass', classId)
					.then(function() {
					})
					console.log("deleted class")
				})
				.then(function() {
					// Delete class can only be called by administrator, so only admin classes need to be updated
					self.loadingClasses = true
					self.updateAdminClasses()
					.then(function() {
						self.modalDeleteClassIsOpen = false
						self.$store.commit('CURRENT_CLASS_SELECT', { name: 'Home' }) // Sets the current showing class state to home
						self.loadingClasses = false
					})
				})
			},
			// Administrator, professor
			setCurrentClass(classObject) {
				this.loadingClasses = true
				// Update students. This is needed to show the little number of requested enrollments in the sidebar
				var self = this
				this.$store.commit('RESET_ASSIGNMENTS')
				this.$store.commit('CURRENT_CLASS_SELECT', classObject)
				this.updateStudents()
				.then(function() {
					self.updateAssignments()
					// console.log(self.requestedStudents)
				})
				.then(function() {
					self.loadingClasses = false
				})
			},
			createClass() {	
				// This function runs when user clicks create class
				// It saves the last genre tree and then POSTs the class
				// It opens assignments modal to create first assignment

				for(var g in this.selectedNodes) {
					if (this.selectedNodes[g].genreName === this.currentGenre) {
						var self = this
						new Promise(function () {
							self.selectedNodes[g].selectedNodes = self.$refs.elementTreeRef.getCheckedKeys(true)
						})
						break
					}
				}

				this.newClass.catFilter = this.selectedNodes
				this.newClass['professorId'] = this.userId

				var self = this
				// console.log("Now POSTing new class to server:", this.newClass)
				this.$store.dispatch('createClass', {newClass: this.newClass})
				.then(function(response) {
					self.loadingClasses = true
					self.updateAdminClasses()
					.then(function () {
						self.loadingClasses = false
					})
					
					// Select created class
					self.$store.commit('CURRENT_CLASS_SELECT', {
						name: response.data.data.name, 
						id: response.data.data.id, 
						number: response.data.data.number, 
						department: response.data.data.department,
						catFilter: response.data.data.catFilter
					})
				})
				this.handleNewClassClose()
				// todo
				this.assignmentsBadgeOn = true
			},
			saveNewCustomCategories() {
				// This function runs when user clicks save on edit categories modal
				// It saves the last genre tree and then PUTs the class with the new cat filter


				for(var g in this.selectedNodes) {
					if (this.selectedNodes[g].genreName === this.currentGenre) {
						var self = this
						new Promise(function () {
							self.selectedNodes[g].selectedNodes = self.$refs.elementTreeRef.getCheckedKeys(true)
						})
						break
					}
				}

				this.currentClass.catFilter = this.selectedNodes

				var self = this
				console.log("Now PUTing edited class to server:", this.currentClass)
				this.$store.dispatch('editClass', {currentClass: this.currentClass})
				.then(function(response) {
					self.loadingClasses = true
					self.updateAdminClasses()
					.then(function () {
						self.loadingClasses = false
					})
				})
				this.handleEditCategoriesClose()
			},
			archiveClass() {
				// 1. Adds current class to Archived Classes.
				// 2. Removes current class from Active Classes.
				// 3. Modifies classes object.
				var objectToBeArchived = {}
				var objectId
				for (var i = 0, l = this.classes.length; i < l; i++) {
					if (this.classes[i].id === this.currentClass.id && !this.classes[i].archived) {
						this.classes[i].archived = true
						objectId = this.classes[i].id
						objectToBeArchived = this.classes[i]
						break
					}
				}
				var self = this
				this.$store.dispatch('archiveClass', { 
					classId: objectId,
					classObject: objectToBeArchived 
				})
				.then(function() {
					self.loadingClasses = true
					self.updateAdminClasses()
					.then(function () {
						self.loadingClasses = false
					})

					self.modalArchiveClassIsOpen = false // Closes the modal

					self.$store.commit('CURRENT_CLASS_SELECT', { name: 'Home' }) // Sets the current showing class state to home
				})
				.catch(function(err) {
					console.log('Error on archive class PUT: ', err)
				})
				
			},
			unArchiveClass() {
				var objectToBeUnarchived = {}
				var objectId
				for (var i = 0, l = this.classes.length; i < l; i++) {
					if (this.classes[i].id === this.classIdClicked && this.classes[i].archived) {
						this.classes[i].archived = false
						objectId = this.classes[i].id
						objectToBeUnarchived = this.classes[i]
						break
					}
				}
				var self = this
				this.$store.dispatch('unArchiveClass', { 
					classId: objectId,
					classObject: objectToBeUnarchived 
				})
				.then(function() {
					self.loadingClasses = true
					self.updateAdminClasses()
					.then(function () {
						self.loadingClasses = false
						self.sidebarClassesTab = 'activeClasses'
					})

					self.modalUnarchiveClassIsOpen = false

					self.$store.commit('CURRENT_CLASS_SELECT', 
					{ 
						name: objectToBeUnarchived.name, 
						id: objectToBeUnarchived.id, 
						number: objectToBeUnarchived.number, 
						department: objectToBeUnarchived.classDepartment 
					})				
				})
				.catch(function(err) {
					console.log('Error on unarchive class PUT: ', err)
				})
			},
			openModalUnarchiveClass(classId) {
				this.classIdClicked = classId
				this.modalUnarchiveClassIsOpen = true
			},
			// STUDENT REQUESTS
			// administrator, professor
            toggleModalStudentRequests() {
				if (this.modalStudentRequestsIsOpen) {
					this.modalStudentRequestsIsOpen = false
					this.loadingModalStudents = false
				}
				else{
					this.modalStudentRequestsIsOpen = true
					this.modalStudentRequestsTab = 'enrolledStudents'
					this.loadingModalStudents = true
				}
				var self = this
				this.updateStudents()
				.then(function() {
					self.loadingModalStudents = false
				})
			},
            updateStudents() {
				// This method updates the "student requests", ie enrolledStudents, requestedStudents, otherStudents
				// It relies on the store's classEnrolledStudents and classEnrollments, which get updated first.
				
				var self = this
				return this.$store.dispatch('getEnrolledUsersByClassId', this.currentClass.id) // Update the store.classEnrolledStudents array first
				.then(function() {
					// console.log("Class enrolled students: ", self.classEnrolledStudents)
					return self.$store.dispatch('getEnrollmentsByClassId', self.currentClass.id)
				})
				.then(function() {
					// console.log("Class enrollments: ", self.classEnrollments)
					self.enrolledStudents = []
					self.filteredEnrolledStudents = []
					self.requestedStudents = []
					self.filteredRequestedStudents = []
					self.otherStudents = []
					self.filteredOtherStudents = []

					// Initialize otherStudents with all students registered to MT
					for (var u = 0; u < self.users.length; u++) {
						if (self.users[u].role === 'student')
							self.otherStudents.push(self.users[u])
							// console.log(self.otherStudents)
					}
					self.filteredOtherStudents = self.otherStudents

					for (var s = 0; s < self.classEnrolledStudents.length; s++) {
						for (var e = 0; e < self.classEnrollments.length; e++) {
							if (self.classEnrollments[e].userId === self.classEnrolledStudents[s].id) {
								if (self.classEnrollments[e].accepted) {
									self.enrolledStudents.push(self.classEnrolledStudents[s])
									self.filteredEnrolledStudents.push(self.classEnrolledStudents[s])
								}
								else {
									self.requestedStudents.push(self.classEnrolledStudents[s])
									self.filteredRequestedStudents.push(self.classEnrolledStudents[s])
								}
							}
						}
						// Remove enrolled/requested student from otherStudents
						for (var o = self.otherStudents.length - 1; o >= 0; o--) {
							if (self.otherStudents[o].id === self.classEnrolledStudents[s].id) {
								// console.log("Splicing ", s, " - ", self.classEnrolledStudents[s].lastName)
								self.otherStudents.splice(o, 1)
								self.filteredOtherStudents = self.otherStudents
								break
							}
						}
					}
					// console.log(self.enrolledStudents)
					// console.log(self.requestedStudents)
					// console.log(self.otherStudents)
				})
				.catch(function(err) {
					console.log("Error while updating enrolled users of class: ", err)
				})
            },
			acceptStudent(index, row) {				
				// Accept student locally
				this.requestedStudents.splice(index, 1)
				this.filteredRequestedStudents = this.requestedStudents
				this.enrolledStudents.push(row)
				this.filteredEnrolledStudents.push(row)

				this.loadingModalStudents = true

				// Handle the enrollment resource
				var usersId = row.id
				var enrollmentToBeAccepted = null
				var self = this
				// console.log("Starting accept procedure...")
				return this.$store.dispatch("getAllUserEnrollmentsByUserId", usersId) // Update state.userEnrollments
                .then(function (response) {
					// Need to search for currentClass.id to get the enrollment resource
                    for (var i = 0, l = self.userEnrollments.length; i < l; i++) {
                        if (self.userEnrollments[i].classId === self.currentClass.id) {
							enrollmentToBeAccepted = self.userEnrollments[i]
							break
						}
					}
					try {
						enrollmentToBeAccepted.accepted = true
						// console.log("Get user enrollment successful", enrollmentToBeAccepted)
						return
					}
					catch(err){
						console.log("Error while accepting enrollment. Enrollment to be accepted not found?", err)
					}
				})
				.then(function(){
					return self.$store.dispatch("editEnrollment", enrollmentToBeAccepted)
					.then(function() {
						return self.updateStudents()
						.then(function() {
							// console.log("accept procedure finished")
							self.loadingModalStudents = false
						})
					})
				})
                .catch(function(err){
                    console.log(err)
                })
				
			},
            acceptAllStudents() {
				// Accepts all requested students for this class
				
				for (var s = this.requestedStudents.length - 1; s >= 0; s--) {
					// console.log("calling accept for ", this.requestedStudents[s].firstName, " ", this.requestedStudents[s].lastName)
					this.loadingModalStudents = true
					var self = this
					this.acceptStudent(s, this.requestedStudents[s])
					.then(function() {
						if (s == -1){
							self.loadingModalStudents = false
							self.modalStudentRequestsTab = 'enrolledStudents'
						}
					})
				}

			},
			enrollStudent(index, row) {
				// Administrator feature
				// Enroll student bypasses the request procedure and 
				// enrolls a student to a class with an accepted enrollment

				this.loadingModalStudents = true

				// Accept student locally
				this.otherStudents.splice(index, 1)
				this.filteredOtherStudents = this.otherStudents
				this.enrolledStudents.push(row)
				this.filteredEnrolledStudents.push(row)

				// Create the new enrollment
				var userToBeAcceptedId = row.id
				
				var newEnrollment = {
					"classId": this.currentClass.id,
					"userId": userToBeAcceptedId,
					"accepted": true // Auto-accept
				}

				var self = this
				this.$store.dispatch("createEnrollment", newEnrollment)
				.then(function() {
					self.updateStudents()
					.then(function() {
						self.loadingModalStudents = false
						self.modalStudentRequestsTab = "otherStudents"
					})
				})
			},
			deleteEnrollment(index, s) {
				// Administrator feature
				// Deletes enrollment of student

				this.loadingModalStudents = true

				// Delete enrollment locally
				this.enrolledStudents.splice(index, 1)
				this.filteredEnrolledStudents = this.enrolledStudents
				this.otherStudents.push(s)
				this.filteredOtherStudents.push(s)

				var usersId = s.id
				var self = this
				this.$store.dispatch("getAllUserEnrollmentsByUserId", usersId) // Update state.userEnrollments
				.then(function() {
					var enrollmentToBeDeletedId = ''
					for (var u = 0; u < self.userEnrollments.length; u++) {
						if (self.userEnrollments[u].userId === usersId) {
							enrollmentToBeDeletedId = self.userEnrollments[u].id
							break
						}
					}
					return self.$store.dispatch("deleteEnrollment", enrollmentToBeDeletedId)
				})
				.then(function() {
					self.updateStudents()
					.then(function() {
						self.loadingModalStudents = false
						self.modalStudentRequestsTab = "enrolledStudents"
					})
				})
			},
			deleteRequest(index, s) {
				// Administrator feature
				// Deletes enrollment request of student

				this.loadingModalStudents = true

				// Delete enrollment locally
				this.requestedStudents.splice(index, 1)
				this.filteredRequestedStudents = this.requestedStudents
				this.otherStudents.push(s)
				this.filteredOtherStudents.push(s)

				var usersId = s.id
				var self = this
				this.$store.dispatch("getAllUserEnrollmentsByUserId", usersId) // Update state.userEnrollments
				.then(function() {
					var enrollmentToBeDeletedId = ''
					for (var u = 0; u < self.userEnrollments.length; u++) {
						if (self.userEnrollments[u].userId === usersId && self.userEnrollments[u].classId === self.currentClass.id) {
							enrollmentToBeDeletedId = self.userEnrollments[u].id
							break
						}
					}
					return self.$store.dispatch("deleteEnrollment", enrollmentToBeDeletedId)
				})
				.then(function() {
					self.updateStudents()
					.then(function() {
						self.loadingModalStudents = false
						self.modalStudentRequestsTab = "enrolledStudents"
					})
				})
			},
			// ASSIGNMENTS
			openAssignmentsModal(firstTime = false){
				this.loadingAssignments = true
				this.videosWithoutUserSubs = []
				var self = this
				this.updateAssignments()
				.then(function() {
					self.loadingAssignments = false
					if (firstTime) {
						self.startingAssignmentMessageVisible = true
					}
				})
				.then(function() {
					self.modalClassAssignmentsIsOpen = true
				})
			},
			updateAssignments() {
				return this.$store.dispatch('getAssignments', this.currentClass.id)
			},
			createAssignment() {
				if (this.currentClass.id !== '' && this.assignmentTitle !== '' && this.assignmentDescription !== '' && this.assignmentGenre !== '' && this.assignmentDueDate !== '') {
					this.$store.dispatch('createAssignment', {
						classId: this.currentClass.id,
						title: this.assignmentTitle,
						description: this.assignmentDescription,
						genre: this.assignmentGenre,
						dueDate: this.assignmentDueDate
					})
					this.assignmentTitle = ''
					this.assignmentDescription = ''
					this.assignmentGenre = ''
					this.assignmentDueDate = ''
					this.assignmentsBadgeOn = false
				} else {
					this.$message({
						showClose: true,
						message: "Please complete all assignment fields.",
						type: 'warning'
					});
				}
			},
			deleteAssignment(assignmentId) {
				console.log('delete assignment')
				this.$store.dispatch('deleteAssignment', assignmentId)
			},
			// edit functionality
			toggleTitleEdit(ev) {
				console.log("toggleTitleEdit()")
				ev.currentTarget.style.display = 'none'
				ev.currentTarget.parentElement.getElementsByClassName('assignments__titleInput')[0].style.display = 'block'
			},
			saveTitleEdit(ev, currentAssignmentId) {
				console.log("saveTitleEdit()")
				ev.currentTarget.style.display = 'none'
				ev.currentTarget.parentElement.getElementsByClassName('assignments__titleText')[0].style.display = 'block'

				let assignmentObj = { classId: '', title: '', description: '', genre: '', id: '' }
				
				for (var i = 0, l = this.assignments.length; i < l; i++) {
					if (this.assignments[i].id === currentAssignmentId) {
						assignmentObj.classId = this.assignments[i].classId
						assignmentObj.title = ev.currentTarget.parentElement.getElementsByClassName('assignments__titleInput')[0].value
						assignmentObj.description = this.assignments[i].description
						assignmentObj.genre = this.assignments[i].genre
						assignmentObj.id = currentAssignmentId
					}
				}
				this.$store.dispatch('editAssignment', {
					id: currentAssignmentId,
					assignment: assignmentObj
				})
			},
			toggleDescriptionEdit(ev) {
				console.log("toggleDescriptionEdit()")
				ev.currentTarget.style.display = 'none'
				ev.currentTarget.parentElement.getElementsByTagName('textarea')[0].style.display = 'block'
				console.log(this.assignments) 
			},
			saveDescriptionEdit(ev, currentAssignmentId) {
				console.log("saveDescriptionEdit()")
				ev.currentTarget.style.display = 'none'
				ev.currentTarget.parentElement.getElementsByClassName('assignments__descText')[0].style.display = 'block'

				let assignmentObj = { classId: '', title: '', description: '', genre: '', id: '' }

				for (var i = 0, l = this.assignments.length; i < l; i++) {
					if (this.assignments[i].id === currentAssignmentId) {
						assignmentObj.classId = this.assignments[i].classId
						assignmentObj.title = this.assignments[i].title
						assignmentObj.description = ev.currentTarget.parentElement.getElementsByClassName('assignments__descText')[0].innerHTML
						assignmentObj.genre = this.assignments[i].genre
						assignmentObj.id = currentAssignmentId
					}
				}
				
				this.$store.dispatch('editAssignment', {
					id: currentAssignmentId,
					assignment: assignmentObj
				})
			},
			toggleGenreEdit(ev) {
				console.log("toggleGenreEdit()")
				ev.currentTarget.style.display = 'none'
				ev.currentTarget.parentElement.getElementsByClassName('assignments__genreSelect')[0].style.display = 'block'
			},
			saveGenreEdit(ev, currentAssignmentId) {
				console.log("saveGenreEdit()")
				ev.currentTarget.style.display = 'none'
				ev.currentTarget.parentElement.getElementsByClassName('assignments__genreName')[0].style.display = 'block'

				let assignmentObj = { classId: '', title: '', description: '', genre: '', id: '' }
				
				for (var i = 0, l = this.assignments.length; i < l; i++) {
					if (this.assignments[i].id === currentAssignmentId) {
						assignmentObj.classId = this.assignments[i].classId
						assignmentObj.title = this.assignments[i].title
						assignmentObj.description = this.assignments[i].description
						assignmentObj.genre = ev.currentTarget.parentElement.getElementsByClassName('assignments__genreSelect')[0].value
						assignmentObj.id = currentAssignmentId
					}
				}
				this.$store.dispatch('editAssignment', {
					id: currentAssignmentId,
					assignment: assignmentObj
				})
			},
			saveDueDateEdit(date, currentAssignmentId) {
				console.log("saveGenreEdit()")

				this.$store.dispatch('editAssignment', {
					id: currentAssignmentId,
					assignment: { dueDate: date}
				})
			},
			// CATEGORIES
			createElementTree(tree) {
				// This function gets a tree in the backend form and returns an element tree

				// console.log("creating element tree from:", tree)
				var elementTreeForm = []
				// Loop through given tree's canons
				for (var canon in tree) {
					// console.log(tree[canon])
					// Add canon
					elementTreeForm.push({
						label: canon,
						id: '', //tree[canon].id, // doesnt exist on backend
						desc: '',
						children: []
					})						
					// Add canon description, if one exists
					if (tree[canon].description) {
						elementTreeForm[elementTreeForm.length - 1].desc = 
							tree[canon].description
					}
					// Loop through this canon's categories
					for (var cat in tree[canon].categories) {
						// console.log(tree[canon].categories[cat])
						// Add canon's category
						elementTreeForm[elementTreeForm.length - 1].children.push({
							label: tree[canon].categories[cat].name,
							id: tree[canon].categories[cat].id,
							desc: '', 
							children: []
						})
						// Add category's description, if one exists
						if (tree[canon].categories[cat].description) {
							elementTreeForm[elementTreeForm.length - 1].children[elementTreeForm[elementTreeForm.length - 1].children.length - 1].desc = 
								tree[canon].categories[cat].description
						}
						// Loop through this category's subcategories if there are any
						for (var subCat in tree[canon].categories[cat].subcategories) {
							// console.log(tree[canon].categories[cat].subcategories[subCat])
							// Add subcategory
							elementTreeForm[elementTreeForm.length - 1].children[elementTreeForm[elementTreeForm.length - 1].children.length - 1].children.push({
								label: tree[canon].categories[cat].subcategories[subCat].name,
								id: tree[canon].categories[cat].subcategories[subCat].id,
								desc: ''
								//children: [] //sub-subcategories
							})
							// Add subcategory's description, if one exists
							if (tree[canon].categories[cat].subcategories[tree[canon].categories[cat].subcategories.length - 1].description) {
								elementTreeForm[elementTreeForm.length - 1].children[elementTreeForm[elementTreeForm.length - 1].children.length - 1].children[elementTreeForm[elementTreeForm.length - 1].children[elementTreeForm[elementTreeForm.length - 1].children.length - 1].children.length - 1].desc = 
									tree[canon].categories[cat].subcategories[subCat].description
							}
							// More subcategories/children can be added here
						}
					}
				}
				return elementTreeForm
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
				// Gets an idArray and returns a custom backend form tree
				
                // Deep copy basic tree
                var customCanonTree = this.copy(this.canons)
                var cans = customCanonTree
                for(var can in cans) {
                    var cats = customCanonTree[can].categories
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
				return customCanonTree
            },
			addNewCategory() {
				console.log("Adding ", this.newCategoryName, "category to ", this.newCategoryCanon, "canon")
				console.log("With description ", this.newCategoryDesc)
				console.log("TODO")
				// for (var canon = 0; canon < this.canons.length; canon++) {
				// 	if (this.canons[canon].label === this.newCategoryCanon) {
				// 		this.canons[canon].children.push(
				// 			{
				// 				label: this.newCategoryName, 
				// 				desc: this.newCategoryName
				// 			}
				// 		)
				// 		this.newCategoryName = ''
				// 		this.newCategoryDesc = ''
				// 		this.newCategoryCanon = ''
				// 	}
				// }
			},
			// categoriesListChanged() {
			// 	console.log(this.categoriesCheckList)
			// 	console.log('fetchCategories')
			// },
		},
        computed: {
            ...mapGetters(
				['videos', 'classes', 'currentClass',
				 'assignments', 'genres', 'categories', 
				 'enrollments', 'userEnrollments', // Mainly used for student side of enrollments
				 'classEnrolledStudents', 'classEnrollments', 'users', // Mainly used for admin/professor side of enrollments
				 'canons', 'userCollaborated'
				]
            )
		},
		components: {
			'mt-video-itemlist': MtVideoItemList
		}
    }
</script>

<style>
/* ==============================================
                #ADMIN-SIDEBAR
	================================================= */

	.sidebar {
		margin: 0;
		padding: 0;
		background-color: #F9F9F9;
	}

	.sidebar__actions {
		margin-top: 15px;	
		display: flex;
		flex-direction: column;
	}

		.sidebar__actionsLink {
			padding: 10x 15px 10px 15px !important;
		}


	.sidebar__classes {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
	}

		.sidebar__classesInput {
			margin-bottom: 10px;
		}

		.sidebar__classesLink {

		}

		.sidebar a {
			color: #4a4a4a;
			font-size: 13px;
			margin: 0;
			padding: 12px 12px 12px 12px;
		}
		.sidebar a:hover {
			background-color: #f5f5f5;
		}
			.sidebar a i {
				padding-right: 5px;
			}

	/* ==============================================
                #ENROLL-TO-CLASS CLASSES-CARD
	================================================= */

	.student__enrollModal .el-dialog__body {
		display: flex;
		flex-wrap: wrap;
	}
			.classes-card {
				background-color: rgba(169,9,49,0.04);
				color: #A90931 !important;
				padding: 45px;
				margin: 10px !important;
				height: auto;
				transition:  box-shadow 0.5s ease;
				width: 250px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
				.classes-card:hover {
					cursor: pointer;
					transition: 0.2s;
					-webkit-transition: 0.2s;
					background-color: #A90931 !important;
					color: #FFF !important;
				}

				.classes-card-title {
					text-align: center;
					font-size: 18px;
				}



	/* ==============================================
                #MODAL-ASSIGNMENTS
	================================================= */
		.assignments-content {

		}

			.assignments__title {
				font-size: 16px;
			}

				.assignments__titleId {
					visibility: hidden;
				}

				.assignments__titleText {
					cursor: text;
					padding: 5px 0px;
				}
				.assignments__titleText:hover {
					background-color: #EFE00B;
				}
				.assignments__titleText__noEdit:hover {

				}
				.assignments__titleInput {
					display: none;
				}

			.assignments__desc {
				font-size: 16px
			}

				.assignments__descTitle {
				}

				.assignments__descId {
					visibility: hidden;
				}
				
				.assignments__descText {
					cursor: text;
					padding: 5px 0px;
				}
				.assignments__descText:hover {
					background-color: #EFE00B;
				}
				.assignments__descText__noEdit:hover {

				}
				.assignments__descTextarea {
					display: none;
				}

			
			.assignments__genre {

			}

				.assignments__genreTitle {
					font-size: 16px;
				}
				.assignments__genreId {
					visibility: hidden;
				}

				.assignments__genreName {
					font-size: 16px;
					cursor: text;
					padding: 5px 0px;
				}
				.assignments__genreName:hover {
					background-color: #EFE00B;
				}
				.assignments__genreName__noEdit:hover {

				}

				.assignments__genreSelect {
					display: none
				}


			.assignments__dueDate {

			}

				.assignments__dueDateTitle {
					font-size: 16px;
				}
				.assignments__dueDateId {
					visibility: hidden;
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
			#BADGE
================================================= */

.badge {
	position:relative;
}
.badge[data-badge]:after {
	content:attr(data-badge);
	position:absolute;
	top:3px;
	right:-5px;
	font-size:.7em;
	background:green;
	color:white;
	width:18px;height:18px;
	text-align:center;
	line-height:18px;
	border-radius:50%;
	box-shadow:0 0 1px #333;
}

.dot {
	height: 8px;
	width: 8px;
	background-color: #ff0000;
	border-radius: 50%;
	display: inline-block;
	margin-bottom: 10px;
}

</style>
