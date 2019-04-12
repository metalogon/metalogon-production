<template>

		<aside class="sidebar column is-2 aside">

			<!-- Sidebar buttons/actions  -->
			<div class="sidebar__actions" v-if="!loadingClasses">
				<a class="sidebar__actionsLink" @click="toggleModalClassesToEnroll()"><i class="fa fa-plus"></i>Find a class to enroll</a>
				<a class="sidebar__actionsLink" v-if="(currentClass.name !== 'Home')" @click="openAssignmentsModal()"><i class="fa fa-file-text-o"></i>Class Assignments</a>
			</div>

			<!-- Sidebar Classes menu -->
			<div class="sidebar__classes">	
				<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingClasses" 
					v-if="loadingClasses"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
				<!-- The two lines below don't show if the acceptedClasses array is empty, so there is no need for a v-if="!loadingClasses" -->
				<el-input class="sidebar__classesInput" v-if="acceptedClasses.length !== 0" icon="search" v-model="searchInputClassSidebar" @change="filterClassArray('acceptedClasses', 'filteredAcceptedClasses', searchInputClassSidebar)" placeholder="Search for a class..."></el-input>
				<a class="sidebar__notActive" v-for="c in requestedClasses" :key="c.id" v-if="searchInputClassSidebar === ''">{{ c.number }} - {{ c.name }}</a>
				<a class="sidebar__classesLink" v-for="c in filteredAcceptedClasses" :class="{ 'is-bg-light' : (currentClass.name === c.name) }"  :key="c.id" @click="setCurrentClass(c)">{{ c.number }} - {{ c.name }}</a>
			</div>

			<!-- Assignments -->
			<el-dialog v-bind:title="this.currentClass.name + ' Class assignments'" :visible.sync="modalClassAssignmentsIsOpen" class="modal-class-assignments" v-if="!!currentClass.id">
				<!-- Loading Screen -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingAssignments" 
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"></div>
                <el-tabs v-show="!loadingAssignments" @tab-click="changeAssignmentTabEvent">
					
                    <el-tab-pane v-for="a in assignments" :key="a.id" :label="a.title">
                		<el-tabs v-model="assignmentsModalSubtab" v-if="!loadingAssignments">
							<el-tab-pane label="General" name="General">
								<div class="assignments-content">
									<span class="assignments__title">
										<strong>Title:</strong>
										<span class="assignments__titleId">{{ a.id }}</span>
										<!-- Simple viewing for student -->
										<p class="assignments__titleText_noEdit">{{ a.title }}</p>
									</span>
									<hr>
									<span class="assignments__desc">
										<strong class="assignments__descTitle">Description:</strong>
										<span class="assignments__descId">{{ a.id }}</span>
										<!-- Simple viewing for student -->
										<p class="assignments__titleText_noEdit">{{ a.description }}</p>
									</span>
									<hr>
									<span class="assignments__genre" v-for="g in genres" v-if="g.id === a.genre" :key="g.id">
										<strong class="assignments__genreTitle">Genre:</strong> 
										<span class="assignments__genreId">{{ a.id }}</span>
										<!-- Simple viewing for student -->
										<p class="assignments__genreName__noEdit">{{ g.name }}</p>
									</span>
									<hr>
									<span class="assignments__dueDate">
										<strong class="assignments__dueDateTitle">Due date:</strong>
										<span class="assignments__dueDateId">{{ a.id }}</span>
										<p>
											<!-- Simple viewing for student -->
											<el-date-picker type="date" placeholder="Pick a date" v-model="a.dueDate" :readonly="true"></el-date-picker>
										</p>
									</span>
								</div>
							</el-tab-pane>
							<el-tab-pane label="My Submission" name="MySubmission">
								<mt-video-itemlist v-for="v in userCollaborated" v-bind:key="v.id" :currentVideo="v" v-if="v.assignmentId === a.id" :enableStatistics="false" :showCollaborators="false"></mt-video-itemlist>
							</el-tab-pane>
							<el-tab-pane label="Class Submissions" name="ClassSubmissions">
								<mt-video-itemlist v-for="v in videosWithoutUserSubs" v-bind:key="v.id" :currentVideo="v" v-if="v.assignmentId === a.id" :enableStatistics="false" :showCollaborators="false"></mt-video-itemlist>
							</el-tab-pane>
                		</el-tabs>
						
                    </el-tab-pane>
                </el-tabs>
				<p v-if="assignments.length === 0 && !loadingAssignments" ><i>No assignments</i></p>
            </el-dialog>
	

			<!-- Student - Find a class to enroll modal -->
			<el-dialog title="Find a class to enroll" class="modal-student-requests" :visible.sync="modalClassesToEnrollIsOpen">
				<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingModalClasses" 
					v-if="loadingModalClasses"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
				<el-tabs v-model="modalClassesRequestsTab" v-if="!loadingModalClasses">
                    <el-tab-pane label="Classes to enroll" name="classesToEnroll">
						<p v-if="notEnrolledClasses.length === 0" ><i>No classes to enroll</i></p>
						<el-input icon="search" v-if="notEnrolledClasses.length !== 0" v-model="searchInputClassModal" @change="filterClassArray('notEnrolledClasses', 'filteredNotEnrolledClasses', searchInputClassModal)" placeholder="Search for a class..." style="width:220px;margin-bottom:7px;" class="mt-search-input"></el-input>
                        <div class="mt-table">
							<li class="mt-table__row" v-for="c in filteredNotEnrolledClasses" :key="c.id">
								<span>
									<i class="fa fa-book"></i>
									<span>{{ c.name }} - {{ c.semester }}</span>
								</span>
								<span style="visibility:hidden;font-size:2px;">{{ c.id }}</span>
								<el-button size="small" type="info" style="" @click="requestToEnrollToClass($event)">Request enrollment</el-button>
							</li>
						</div>
                    </el-tab-pane>
					<el-tab-pane name="requestsPending">
    					<span slot="label">Requests pending ({{requestedClasses.length}})</span> <!-- Dynamic tab label --> 
                        <span v-if="requestedClasses.length === 0"><i>No requests pending</i></span>
						<div label="" class="mt-table" v-if="!loadingModalClasses">
							<li v-for="(c, index) in requestedClasses" :key="c.id">
								<a><i class="fa fa-book"></i> {{ c.number }} - {{ c.name }} - {{ c.department }} - {{ c.semester }}</a>
								<el-button size="small" type="info" @click="deleteRequest(index, c)" style="float: right; margin:-2px;">Cancel request</el-button>
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
		data() {
			return {
				// GENERAL
				userId: this.$root.$options.authService.getAuthData().userId,
				loadingClasses: false,
				loadingModalClasses: false,
				loadingAssignments: false,
				// CLASSES
				searchInputClassModal: '',           // Used in search text area in find a class to enroll modal
				searchInputClassSidebar: '',         // Used in search text area in sidebar classes
				// Student classes
				modalClassesRequestsTab: 'classesToEnroll', // Required to select a tab
				acceptedClasses: [],            // The classes that this student is enrolled to
				filteredAcceptedClasses: [],
				notEnrolledClasses: [],         // The classes that this student hasn't enrolled or requested
				filteredNotEnrolledClasses: [],
				requestedClasses: [],           // The classes that this student has requested to be enrolled

				// MODALS
				modalClassAssignmentsIsOpen: false,
				// Student
				modalClassesToEnrollIsOpen: false,
				videosWithoutUserSubs: [], // List of all class videos for current assignment

				// ASSIGNMENTS
				assignmentsModalSubtab: 'General',
			}
		},
		mounted () {
			this.$store.dispatch('getCategories')
			// Initialize classes arrays
			this.loadingClasses = true
			var self = this
            self.updateStudentClasses()
            .then(function() {
                self.loadingClasses = false
            })
		},
		methods: {
			changeAssignmentTabEvent() {
				this.loadingAssignments = true
				this.videosWithoutUserSubs = []
				var self = this
				this.updateAssignments()
				.then(function() {
					self.updateStudentMySubmissions()
				})
				.then(function() {
					self.loadingAssignments = false
				})
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
			updateStudentClasses(){
				// This method updates the "student classes", ie acceptedClasses, requestedClasses, notEnrolledClasses
				// It relies on the store's classes, enrolledClasses and userEnrollments, which all get updated first.

				// console.log("dispatching get all classes")
				var self = this
				return this.$store.dispatch("getAllClasses") // Update state.classes
				.then(function() {
					// console.log("dispatching getAllUserEnrollmentsByUserId")
					return self.$store.dispatch("getAllUserEnrollmentsByUserId", self.userId) // Update state.userEnrollments
				})
				.then(function() {
					// console.log("dispatching getEnrolledClassesByUserId")
					return self.$store.dispatch("getEnrolledClassesByUserId", self.userId) // Update state.enrolledClasses
				})
				.then(function() {
					self.acceptedClasses = []
					self.filteredAcceptedClasses = []
					self.requestedClasses = []
					self.notEnrolledClasses = []
					self.filteredNotEnrolledClasses = []
					
					self.notEnrolledClasses = self.classes
					self.filteredNotEnrolledClasses = self.classes

					for (var ec = 0; ec < self.enrolledClasses.length; ec++) {
						if (!self.enrolledClasses[ec].archived) {
							// Search enrollments for self enrolled class
							for (var ue = 0; ue < self.userEnrollments.length; ue++) {
								if (self.userEnrollments[ue].classId === self.enrolledClasses[ec].id) {
									if (self.userEnrollments[ue].accepted) {
										// Accepted enrollment
										// console.log("Accepted ", ec, " - ", self.enrolledClasses[ec].name)
										self.acceptedClasses.push(self.enrolledClasses[ec])
										self.filteredAcceptedClasses.push(self.enrolledClasses[ec])
										break
									}
									else {
										// Not yet accepted enrollment
										// console.log("Requested ", ec, " - ", self.enrolledClasses[ec].name)
										self.requestedClasses.push(self.enrolledClasses[ec])
										break
									}
								}
							}
						}
						// Remove enrolled class from notEnrolledClasses
						for (var nec = self.notEnrolledClasses.length - 1; nec >= 0; nec--) {
							if (self.notEnrolledClasses[nec].id === self.enrolledClasses[ec].id) {
								// console.log("Splicing ", ec, " - ", self.enrolledClasses[ec].name)
								self.notEnrolledClasses.splice(nec, 1)
								self.filteredNotEnrolledClasses = self.notEnrolledClasses
								break
							}
						}
					}
					// console.log(self.acceptedClasses)
					// console.log(self.requestedClasses)
					// console.log(self.notEnrolledClasses)
				})
			},
			updateStudentMySubmissions() {
				// This method updates videosWithoutUserSubs used in the assignments modal, 
				// It relies on the store's userCollaborated which gets updated first.

				var self = this
				return this.$store.dispatch("getCollaboratedVideosByUserId", self.userId) // Update state.userCollaborated
				.then(function() {
					for (var v = 0; v < self.videos.length; v++) {
						// TODO this needs be improved when videos array gets big, check for class or - even better - assignment.
						var found = false
						for (var uc = 0; uc < self.userCollaborated.length; uc++) {
							if (self.videos[v].id === self.userCollaborated[uc].id) {
								found = true
								break
							}
						}
						if (!found) {
							self.videosWithoutUserSubs.push(self.videos[v])
						}
					}
				})
			},
			setCurrentClass(classObject) {
				this.$store.commit('CURRENT_CLASS_SELECT', classObject)
			},
			// ASSIGNMENTS
			openAssignmentsModal(){
				this.loadingAssignments = true
				this.videosWithoutUserSubs = []
				var self = this
				this.updateAssignments()
				.then(function() {
					self.updateStudentMySubmissions()
				})
				.then(function() {
					self.loadingAssignments = false
				})
				.then(function() {
					self.modalClassAssignmentsIsOpen = true
				})
			},
			updateAssignments() {
				return this.$store.dispatch('getAssignments', this.currentClass.id)
			},
			// Student
			toggleModalClassesToEnroll() {
				if (this.modalClassesToEnrollIsOpen) {
					this.modalClassesToEnrollIsOpen = false
					this.loadingModalClasses = false
				}
				else{
					this.modalClassesRequestsTab = "classesToEnroll"
					this.modalClassesToEnrollIsOpen = true
					this.loadingModalClasses = true
				}
				var self = this
				this.updateStudentClasses()
				.then(function() {
					self.loadingModalClasses = false
				})
			},
			requestToEnrollToClass(event) {
				const clickedClassId = event.path[2].children[1].innerHTML
				
				var body = {classId : clickedClassId, userId : this.userId}
				
				var self = this
				this.$store.dispatch('createEnrollment', body)
				.then(function() {
					self.updateStudentClasses()
					.then(function() {
					})
					self.toggleModalClassesToEnroll()
					self.$message({
						showClose: true,
						// message: "Enrollment request sent.",
						message: "The request has been sent. Please wait the professor to accept your request.",
						type: 'success'
					});
				})
				.catch(function(err) {
					console.log("requestToEnrollToClass error: ", err)
				})
			},
			deleteRequest(index, c) {
				// Deletes enrollment request of student

				this.loadingModalClasses = true

				// Delete enrollment locally
				this.requestedClasses.splice(index, 1)

				var self = this
				this.$store.dispatch("getAllUserEnrollmentsByUserId", this.userId) // Update state.userEnrollments
				.then(function() {
					var enrollmentToBeDeletedId = ''
					for (var u = 0; u < self.userEnrollments.length; u++) {
						if (self.userEnrollments[u].userId === self.userId && self.userEnrollments[u].classId === c.id) {
							enrollmentToBeDeletedId = self.userEnrollments[u].id
							break
						}
					}
					return self.$store.dispatch("deleteEnrollment", enrollmentToBeDeletedId)
				})
				.then(function() {
					self.loadingModalClasses = false
				})
			},
		},
        computed: {
            ...mapGetters(
				['videos', 'classes', 'currentClass',
				 'assignments', 'genres', 'categories', 
				 'enrollments', 'userEnrollments', 'enrolledClasses', // Mainly used for student side of enrollments
				 'userCollaborated'
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
		margin-top: -100px !important;
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

		.sidebar__notActive {
			color: #4a4a4a7a !important;
			pointer-events: none ; 
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
</style>
