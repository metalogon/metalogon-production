<template>

		<aside class="sidebar column is-2 aside">

			<!-- Sidebar buttons/actions  -->
			<div class="sidebar__actions" v-show="!loadingClasses">
				<a class="sidebar__actionsLink" v-show="role === 'administrator' || role === 'professor'" @click="modalCreateClassIsOpen = true"><i class="fa fa-plus"></i>Create new class</a>
				<a class="sidebar__actionsLink" v-show="(role === 'administrator' || role === 'professor') && !(currentClass.name === 'Home')" @click="openAssignmentsModal()"><i class="fa fa-file-text-o"></i>Assignments</a>
				<a class="sidebar__actionsLink" v-show="(role === 'administrator' || role === 'professor') && !(currentClass.name === 'Home')" @click="modalArchiveClassIsOpen = true"><i class="fa fa-archive"></i>Archive this class</a>
				<a class="sidebar__actionsLink" v-show="(role === 'administrator' || role === 'professor') && !(currentClass.name === 'Home')" @click="toggleModalStudentRequests()"><i class="fa fa-file-text-o"></i>Student requests ({{ requestedStudents.length }})</a>
				<!-- <a class="sidebar__actionsLink" v-show="role === 'administrator' || role === 'professor'" @click="createCategoriesTreeDataForm(); modalGenreCustomization = true"><i class="fa fa-commenting-o"></i>Categories</a> -->
				<a class="sidebar__actionsLink" v-show="role === 'administrator' && (currentClass.name !== 'Home')" @click="modalDeleteClassIsOpen = true"><i class="fa fa-trash"></i>Delete this class</a>
				<a class="sidebar__actionsLink" v-show="role === 'student'" @click="toggleModalClassesToEnroll()"><i class="fa fa-plus"></i>Find a class to enroll</a>
			</div>

			<!-- Sidebar Classes menu for student -->
			<div class="sidebar__classes" v-show="role === 'student'">	
				<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingClasses" 
					v-show="loadingClasses"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
				<!-- The two lines below don't show if the acceptedClasses array is empty, so there is no need for a v-show="!loadingClasses" -->
				<el-input class="sidebar__classesInput" v-show="acceptedClasses.length !== 0" icon="search" v-model="searchInputClassSidebar" @change="filterClassArray('acceptedClasses', 'filteredAcceptedClasses', searchInputClassSidebar)" placeholder="Search for a class..."></el-input>
				<a class="sidebar__classesLink" v-for="c in filteredAcceptedClasses" :class="{ 'is-bg-light' : (currentClass.name === c.name) }"  :key="c.id" @click="setCurrentClass(c)">{{ c.number }} - {{ c.name }}</a>
			</div>

			<!-- Sidebar Classes menu for administrator-->
			<div class="sidebar__classes" v-show="role === 'administrator'">
				<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingClasses" 
					v-show="loadingClasses"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
				<el-tabs v-model="sidebarClassesTab" v-show="!loadingClasses">
					<el-tab-pane label="Active classes" name="activeClasses">
						<div class="sidebar__classes">
							<i v-show="adminActiveClasses.length === 0"> &nbsp;&nbsp; No classes </i>
							<el-input class="sidebar__classesInput" v-show="adminActiveClasses.length !== 0" icon="search" v-model="searchInputActiveClassSidebar" @change="filterClassArray('adminActiveClasses', 'filteredAdminActiveClasses', searchInputActiveClassSidebar)" placeholder="Search for a class..."></el-input>
							<a class="sidebar__classesLink" v-for="c in filteredAdminActiveClasses"  :class="{ 'is-bg-light' : (currentClass.name === c.name) }" :key="c.id" @click="setCurrentClass(c)">{{ c.number }} - {{ c.name }}</a>
						</div>
					</el-tab-pane>
					<el-tab-pane label="Archived" name="archivedClasses">
						<div class="sidebar__classes">
							<i v-show="adminArchivedClasses.length === 0"> &nbsp;&nbsp; No archived classes </i>
							<el-input class="sidebar__classesInput" v-show="adminArchivedClasses.length !== 0" icon="search" v-model="searchInputArchivedClassSidebar" @change="filterClassArray('adminArchivedClasses', 'filteredAdminArchivedClasses', searchInputArchivedClassSidebar)" placeholder="Search archived classes..."></el-input>							
							<a class="sidebar__classesLink" v-for="c in filteredAdminArchivedClasses" :key="c.id" :class="{ 'is-bg-light' : (currentClass.name === c.name) }" @click="openModalUnarchiveClass(c.id)">{{ c.number }} - {{ c.name }}</a>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
			
			<!-- Sidebar Classes menu for professor-->
			<div class="sidebar__classes" v-show="role === 'professor'">
				<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingClasses" 
					v-show="loadingClasses"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
				<el-tabs v-model="sidebarClassesTab" v-show="!loadingClasses">
					<el-tab-pane label="Active classes" name="activeClasses">
						<div class="sidebar__classes">
							<i v-show="professorActiveClasses.length === 0"> &nbsp;&nbsp; No classes - create one </i>
							<el-input class="sidebar__classesInput" v-show="professorActiveClasses.length !== 0" icon="search" v-model="searchInputActiveClassSidebar" @change="filterClassArray('professorActiveClasses', 'filteredProfessorActiveClasses', searchInputActiveClassSidebar)" placeholder="Search for a class..."></el-input>
							<a class="sidebar__classesLink" v-for="c in filteredProfessorActiveClasses" :class="{ 'is-bg-light' : (currentClass.name === c.name) }" :key="c.id" @click="setCurrentClass(c)">{{ c.number }} - {{ c.name }}</a>
						</div>
					</el-tab-pane>
					<el-tab-pane label="Archived" name="archivedClasses">
						<div class="sidebar__classes">
							<i v-show="professorArchivedClasses.length === 0"> &nbsp;&nbsp; No archived classes </i>
							<el-input class="sidebar__classesInput" v-show="professorArchivedClasses.length !== 0" icon="search" v-model="searchInputArchivedClassSidebar" @change="filterClassArray('professorArchivedClasses', 'filteredProfessorArchivedClasses', searchInputArchivedClassSidebar)" placeholder="Search archived classes..."></el-input>							
							<a class="sidebar__classesLink" v-for="c in filteredProfessorArchivedClasses" :key="c.id" :class="{ 'is-bg-light' : (currentClass.name === c.name) }" @click="openModalUnarchiveClass(c.id)">{{ c.number }} - {{ c.name }}</a>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>

			<!-- administrator, professor -->
			<el-dialog title="Add new class" :visible.sync="modalCreateClassIsOpen">
					<el-form :model="newClass">
							<el-form-item label="Name">
									<el-input v-model="newClass.name" placeholder="Advanced Essay Workshop"></el-input>
							</el-form-item>
							<el-form-item label="Department">
								<el-input v-model="newClass.department" placeholder="Comparative Media Studies / Writing"></el-input>
									<!-- <el-select  placeholder="Choose a department" >
										<el-option v-model="newClass.department" :label="c.department" :value="c.department" v-for="c in classes" v-bind:key="c.title"></el-option>
									</el-select> -->
							</el-form-item>
							<el-form-item label="Number">
									<el-input v-model="newClass.number" placeholder="21W.745"></el-input>
							</el-form-item>
							<el-form-item label="Semester">
									<el-input v-model="newClass.semester" placeholder="Spring 2018"></el-input>
							</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer">
							<el-button @click="modalCreateClassIsOpen = false">Cancel</el-button>
							<el-button class="add-class-btn" @click="createClass(); modalCreateClassIsOpen = false;">Create Class</el-button>
					</span>
			</el-dialog>

			<el-dialog :title="'Do you want to archive `' + currentClass.name + '` class?'" :visible.sync="modalArchiveClassIsOpen">
				<el-button @click="modalArchiveClassIsOpen = false">Go back</el-button>
				<el-button class="add-class-btn" @click="archiveClass()"><strong>Archive Class</strong></el-button>
			</el-dialog>

			<el-dialog :title="'Do you want to unarchive this class?'" :visible.sync="modalUnarchiveClassIsOpen">
				<el-button @click="modalUnarchiveClassIsOpen = false">Go back</el-button>
				<el-button class="add-class-btn" @click="unArchiveClass()"><strong>Unarchive Class</strong></el-button>
			</el-dialog>	

			<el-dialog title="Genre customization" :visible.sync="modalGenreCustomization" size="large">
					<h3 style="margin-bottom:10px;">Choose genre:</h3>
					<el-select v-model="currentGenre" placeholder="Choose a genre" style="width:300px">
						<el-option v-for="g in genres" :key="g.name" :label="g.name" :value="g.name"></el-option>
					</el-select>
					<br>
					<el-button v-show="currentGenre !== ''" style="margin-top:10px" @click="modalAddCategoryIsOpen = true"> Add category</el-button>
					<!-- <el-radio class="radio" v-model="currentGenre" v-for="g in genres" :key="g.name" :label="g.name"></el-radio> -->

					<br/>
					<br/>
					<div v-show="currentGenre">
						<p>Choose canons:</p>
						<el-tree :data="canons" :props="genreProps" @node-click="handleNodeClick" show-checkbox>
						</el-tree>
					</div>
					
					<span slot="footer" class="dialog-footer">
							<el-button @click="modalGenreCustomization = false; currentGenre = ''">Close</el-button>
					</span>
			</el-dialog>	

			<el-dialog title="Add category" :visible.sync="modalAddCategoryIsOpen" size="small">
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
			</el-dialog>	

			<!-- administrator -->
			<el-dialog :title="'Do you want to delete `' + currentClass.name + '` class?'" :visible.sync="modalDeleteClassIsOpen">
				<el-button @click="modalDeleteClassIsOpen = false">Go back</el-button>
				<el-button class="add-class-btn" @click="deleteClass()"><strong>Delete Class</strong></el-button>
			</el-dialog>

			<!-- administrator, professor -->
			<el-dialog v-bind:title="this.currentClass.name + ' Class assignments'" :visible.sync="modalClassAssignmentsIsOpen" class="modal-class-assignments">
				<!-- Loading Screen -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingAssignments" 
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"></div>
                <el-tabs v-show="!!currentClass.id && !loadingAssignments">
                    <el-tab-pane v-for="a in assignments" :key="a.id" :label="a.title">
						<div class="assignments-content">
							<span class="assignments__title">
								<strong>Title:</strong>
								<span class="assignments__titleId">{{ a.id }}</span>
								<p class="assignments__titleText" @click="toggleTitleEdit($event)">{{ a.title }}</p>
								<input v-model="a.title" @blur="saveTitleEdit($event, a.id)" type="text" class="input assignments__titleInput"></textarea>
							</span>
							<hr>
							<span class="assignments__desc">
								<strong class="assignments__descTitle">Description:</strong>
								<span class="assignments__descId">{{ a.id }}</span>
								<p class="assignments__descText" @click="toggleDescriptionEdit($event)">{{ a.description }}</p>
								<textarea v-model="a.description" @blur="saveDescriptionEdit($event, a.id)" type="text" class="textarea assignments__descTextarea"></textarea>
							</span>
							<hr>
							<span class="assignments__genre" v-for="g in genres" v-if="g.id === a.genre" :key="g.id">
								<strong class="assignments__genreTitle">Genre:</strong> 
								<span class="assignments__genreId">{{ a.id }}</span>
								<p class="assignments__genreName" @click="toggleGenreEdit($event)">{{ g.name }}</p>
								<select v-model="a.genre" @change="saveGenreEdit($event, a.id)" class="assignments__genreSelect select">
									<option v-for="g in genres" :label="g.name" :value="g.id" :key="g.id" class="option"></option>
								</select>
							</span>
							<hr>
							<span class="assignments__dueDate">
								<strong class="assignments__dueDateTitle">Due date:</strong>
								<span class="assignments__dueDateId">{{ a.id }}</span>
								<p>
									<el-date-picker type="date" placeholder="Pick a date" v-model="a.dueDate" @change="saveDueDateEdit($event, a.id)"></el-date-picker>
								</p>
							</span>
							<hr>
							<router-link :to="'/video/' + v.id" tag="div" class="classvideo" v-for="v in videos" :key="v.id" v-if="v.assignmentId === a.id" style="cursor:pointer">
								<div class="classvideo__metadata">
									<img class="classvideo__image" :src="v.thumb">
									<div class="classvideo__titles">
										<p class="classvideo__title">{{ v.title }}</p>
										<p class="classvideo__genre">{{ secondsToMMSS(v.duration) }} / {{ v.genre }} </p>
									</div>
									<div class="classvideo__metameta">
										
									</div>
								</div>
							</router-link>
						</div>
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

			<!-- Administrator/Professor - Student requests -->
			<el-dialog :visible.sync="modalStudentRequestsIsOpen">
				<span class="modal-student-requests" slot="title"><b><i class="fa fa-book"></i> {{currentClass.name}} - Enrollments</b></span>
				<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingModalStudents" 
					v-show="loadingModalStudents"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
                <el-tabs v-model="modalStudentRequestsTab" v-show="!loadingModalStudents">
                    <el-tab-pane label="Enrolled students" name="enrolledStudents">
						<p v-show="enrolledStudents.length === 0" ><i>No enrolled students</i></p>
                        <el-input icon="search" v-show="enrolledStudents.length !== 0" v-model="searchInput" @change="filterStudentsArray('enrolledStudents', 'filteredEnrolledStudents', searchInput)" placeholder="Search for a student..." style="width:220px;margin-bottom:7px;" class="mt-search-input"></el-input>
						<div class="mt-table">
							<li v-for="(s, index) in filteredEnrolledStudents" :key="s.id" style="list-style:none">
								<span><i class="fa fa-user"></i> {{ s.firstName + " " + s.lastName}}</span>
								<el-button v-show="role === 'administrator'" size="small" type="info" @click="deleteEnrollment(index, s)" style="float: right; margin: -2px;">Unenroll</el-button>
							</li>
						</div>
                    </el-tab-pane>
                    <el-tab-pane name="requestedStudents">
						<p v-show="requestedStudents.length === 0" ><i>No enrollment requests</i></p>
    					<span slot="label">Enrollment requests ({{requestedStudents.length}})</span>
                        <el-input icon="search" v-show="requestedStudents.length !== 0" v-model="searchInput" @change="filterStudentsArray('requestedStudents', 'filteredRequestedStudents', searchInput)" placeholder="Search for a student..." style="width:220px;margin-bottom:7px;"></el-input>
						<div class="mt-table">
							<li v-for="(s, index) in filteredRequestedStudents" :key="s.id" style="list-style:none">
								<span><i class="fa fa-user"></i> {{ s.firstName + " " + s.lastName}}</span>
								<el-button v-show="role === 'administrator'" size="small" type="info" @click="deleteRequest(index, s)" style="float: right; margin:-2px;">Delete request</el-button>
								<el-button size="small" type="info" @click="acceptStudent(index, s)" style="float: right; margin: -2px; margin-right: 5px">Accept request</el-button>
							</li>
						</div>
                        <el-button v-show="requestedStudents.length !== 0" sfize="small" type="info" @click="acceptAllStudents()" style="margin-top: 5px;">Accept all requests</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="Other students" name="otherStudents" v-if="role === 'administrator'">
						<p v-show="otherStudents.length === 0" ><i>No other students</i></p>
                        <el-input icon="search" v-show="otherStudents.length !== 0" v-model="searchInput" @change="filterStudentsArray('otherStudents', 'filteredOtherStudents', searchInput)" placeholder="Search for a student..." style="width:220px;margin-bottom:7px;"></el-input>
						<div class="mt-table">
							<li v-for="(s, index) in filteredOtherStudents" :key="s.id" style="list-style:none">
								<span><i class="fa fa-user"></i> {{ s.firstName + " " + s.lastName}}</span>
								<el-button size="small" type="info" style="float: right; margin: -2px;" @click="enrollStudent(index, s)">Enroll student</el-button>
							</li>
						</div>
                    </el-tab-pane>
                </el-tabs>
            </el-dialog>

			<!-- Student - Find a class to enroll modal -->
			<el-dialog title="Find a class to enroll" class="modal-student-requests" :visible.sync="modalClassesToEnrollIsOpen">
				<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingModalClasses" 
					v-show="loadingModalClasses"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
				<el-tabs v-model="modalClassesRequestsTab" v-show="!loadingModalClasses">
                    <el-tab-pane label="Classes to enroll" name="classesToEnroll">
						<p v-show="notEnrolledClasses.length === 0" ><b>No classes to enroll</b></p>
						<el-input icon="search" v-show="notEnrolledClasses.length !== 0" v-model="searchInputClassModal" @change="filterClassArray('notEnrolledClasses', 'filteredNotEnrolledClasses', searchInputClassModal)" placeholder="Search for a class..." style="width:220px;margin-bottom:7px;" class="mt-search-input"></el-input>
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
                        <span v-show="requestedClasses.length === 0"><i>No requests pending</i></span>
						<div label="" class="mt-table" v-show="!loadingModalClasses">
							<li v-for="c in requestedClasses" :key="c.id">
								<a><i class="fa fa-book"></i> {{ c.number }} - {{ c.name }} - {{ c.department }} - {{ c.semester }}</a>
							</li>
						</div>
                    </el-tab-pane>
                </el-tabs>
			</el-dialog>	

			<!-- <el-dialog title="Class Categories" :visible.sync="modalClassCategoriesIsOpen" class="modal-class-categories" size="small">
				<el-select v-model="categoriesGenre" placeholder="Select a genre" style="width:50%" @change="fetchCategories()">
					<el-option v-for="g in genres" :key="g.name" :label="g.name" :value="g.id"></el-option>
				</el-select>
				<div v-if="!!categoriesGenre">
					<p>Choose categories:</p>
					<el-checkbox-group v-model="categoriesCheckList" @change="categoriesListChanged()">
						<p>STRUCTURE</p>
						<el-checkbox :label="cat.name" v-for="cat in categories" v-if="cat.canon === 'Structure'" :key="cat._id" :value="cat.name" checked>
							<strong>{{cat.name}}:</strong> {{cat.description}}
						</el-checkbox>
						<p>DELIVERY</p>
						<el-checkbox :label="cat.name" v-for="cat in categories" v-if="cat.canon === 'Delivery'" :key="cat._id" :value="cat.name" checked>
							<strong>{{cat.name}}:</strong> {{cat.description}}
						</el-checkbox>
						<p>VISUALS</p>
						<el-checkbox :label="cat.name" v-for="cat in categories" v-if="cat.canon === 'Visuals'" :key="cat._id" :value="cat.name" checked>
							<strong>{{cat.name}}:</strong> {{cat.description}}
						</el-checkbox>
						<p>STYLE</p>
						<el-checkbox :label="cat.name" v-for="cat in categories" v-if="cat.canon === 'Style'" :key="cat._id" :value="cat.name" checked>
							<strong>{{cat.name}}:</strong> {{cat.description}}
						</el-checkbox>
						<p>MOVES</p>
						<el-checkbox :label="cat.name" v-for="cat in categories" v-if="cat.canon === 'Moves'" :key="cat._id" :value="cat.name" checked>
							<strong>{{cat.name}}:</strong>
						</el-checkbox>
					</el-checkbox-group>
				</div>
            </el-dialog> -->	
		</aside>

</template>

<script>
	import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
	import _ from 'lodash'
    
    export default {
		props: [],
		data() {
			return {
				// GENERAL
				role: this.$root.$options.authService.getAuthData().role,
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
				// Student classes
				modalClassesRequestsTab: 'classesToEnroll', // Required to select a tab
				acceptedClasses: [],            // The classes that this student is enrolled to
				filteredAcceptedClasses: [],
				notEnrolledClasses: [],         // The classes that this student hasn't enrolled or requested
				filteredNotEnrolledClasses: [],
				requestedClasses: [],           // The classes that this student has requested to be enrolled
				// Administrator classes
				adminActiveClasses: [],         // All not archived classes of metalogon
				filteredAdminActiveClasses: [], 
				adminArchivedClasses: [],
				filteredAdminArchivedClasses: [],
				// Professor classes
				professorActiveClasses: [],         // All not archived classes "owned" by this professor
				filteredProfessorActiveClasses: [],
				professorArchivedClasses: [],
				filteredProfessorArchivedClasses: [],

				// MODALS
				// Student
				modalClassesToEnrollIsOpen: false,
				// Professor, Administrator
				modalCreateClassIsOpen: false,
				modalArchiveClassIsOpen: false,
				modalUnarchiveClassIsOpen: false,
				modalClassAssignmentsIsOpen: false,
				modalStudentRequestsIsOpen: false,
				// Administrator
				modalDeleteClassIsOpen: false,

				// ENROLLMENTS
				// Professor/Administrator side
				modalStudentRequestsTab: 'enrolledStudents', // Required to select a tab. enrolledStudents is the initialization
				enrolledStudents: [],
                filteredEnrolledStudents: [],
				requestedStudents: [],
				filteredRequestedStudents: [],
				otherStudents: [],
				filteredOtherStudents: [],
				// ASSIGNMENTS
				assignmentSelectedId: '',
				assignmentTitle: '',
				assignmentDescription: '',
				assignmentGenre: '',
				assignmentCategorySelected: '',
				assignmentDueDate: '',
				categoriesCheckList: [],

				//-----------------------------------
				// Categories
				// categoriesGenre: '',
				currentGenre: '',
				modalGenreCustomization: false,
				modalAddCategoryIsOpen: false,
				newCategoryCanon: "",
				newCategoryName: "",
				newCategoryDesc: "",
				// Genre customization
				// Genre version 1
				canons: [
					{
						label: 'Moves',
						children: [
					// 		{ label: 'Introduction', children: [
					// 			{ label: 'Shows that the research area is important/central/interesting/problematic/relevant and narrows down to the topic of the research' },
					// 			{ label: 'States the value of the present research and explains why it was conducted' },
					// 			{ label: 'Discusses the definitions of key terms' },
					// 			{ label: 'Summarizes and previews the methods used' },
					// 			{ label: 'Presents basic equations' },
					// 		]},
					// 		{ label: 'Methodology', children: [
					// 			{ label: 'Describes materials and instrumentation in the study' },
					// 			{ label: 'Describes tasks (actions) in the study' },
					// 			{ label: 'Describes the procedures of an experiment (activities)' },
					// 			{ label: 'Presents justification of techniques' },
					// 			{ label: 'Describes variables in the study' },
					// 			{ label: 'Describes the procedures used in data analysis' },
					// 			{ label: 'Describes the relations between the experiment and prior/subsequent experiments' },
					// 		]},
					// 		{ label: 'Results and Discussion', children: [
					// 			{ label: 'Shows that the research area is important/central/interesting/problematic/relevant and narrows down to the topic of the research' },
					// 			{ label: 'States the value of the present research and explains why it was conducted' },
					// 			{ label: 'Discusses the definitions of key terms' },
					// 			{ label: 'Summarizes and previews the methods used' },
					// 			{ label: 'Presents basic equations' },
					// 		]},
					// 		{ label: 'Conclusion', children: [
					// 			{ label: 'xxxxxxxxxx' },
					// 		]},
					// 		{ label: 'Question and Answer', children: [
					// 			{ label: 'xxxxxxxxxx' },
					// 		]},
						]
					}, 
					{
						label: 'Structure',
						children: [
							// {
							// 	"_id": "59a86e7e0110587e400ff79b",
							// 	"name": "Coherence", // child label
							// 	"canon": "Structure", // canon label
							// 	"description": "Connects the central rhetorical moves for each section explicitly to each other" //desc
							// }
							// { label: 'Terms', desc: 'Provides overview of the talk, emphasizing the connection between key terms and concepts'},
							// { label: 'Conceptual transitions' },
							// { label: 'Line of argument' },
							// { label: 'Central moves' },
						]
					}, 
					{
						label: 'Delivery',
						children: [
							// { label: 'Volume' },
							// { label: 'Gestures' },
							// { label: 'Metadiscourse' },
							// { label: 'Posture' },
							// { label: 'Language' },
						]
					}, 
					{
						label: 'Style',
						children: [
							// { label: 'Coherence' },
							// { label: 'Concision' },
							// { label: 'Flow' },
							// { label: 'Emphasis' },
							// { label: 'Figures of Speech' },
							// { label: 'Figures of Sound' },
						]
					},
					{
						label: 'Visuals',
						children: [
							// { label: 'Pictorial cues' },
							// { label: 'Slide titles' },
							// { label: 'Image-text highlight' },
							// { label: 'Graphics' },
							// { label: 'Memorable images' }
						]
					},
				],
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
					semester: ''
				},
			}
		},
		mounted () {
			this.$store.dispatch('getCategories')
			// Initialize classes arrays
			this.loadingClasses = true
			var self = this
			if (this.role === 'student') {
				self.updateStudentClasses()
				.then(function() {
					self.loadingClasses = false
				})
			}
			else if (this.role == 'administrator') {
				self.updateAdminClasses() 
				.then(function() {
					self.loadingClasses = false
				})
			}
			else if (this.role == 'professor') {
				self.updateProfessorClasses() 
				.then(function() {
					self.loadingClasses = false
				})
			}
		},
		methods: {
			// TODO ADD REJECT ENROLLMENT REQUEST BuTTON FOR PROF/ADMIN WHICH DELETES THE ENROLLMENT REQUEST RESOURCE
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
			updateProfessorClasses() {
				// This method updates the "professor classes", ie professorActiveClasses, professorArchivedClasses
				// It relies on the store's classes, which gets updated first.
				var self = this
				return this.$store.dispatch("getAllClasses") // Update state.classes
				.then(function() {
					self.professorActiveClasses = [] // All not archived classes of metalogon
					self.filteredProfessorActiveClasses = [] 
					self.professorArchivedClasses = []
					self.filteredProfessorArchivedClasses = []
					for (var c = 0; c < self.classes.length; c++) {
						if (self.classes[c].professorId === self.userId){
							if (self.classes[c].archived) {
								self.professorArchivedClasses.push(self.classes[c])
								self.filteredProfessorArchivedClasses.push(self.classes[c])
							}
							else {
								self.professorActiveClasses.push(self.classes[c])
								self.filteredProfessorActiveClasses.push(self.classes[c])
							}
						}
					}
				})
			},
			// Administrator
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
				if (this.role === "professor" || this.role === "administrator")
					this.loadingClasses = true
				this.$store.commit('CURRENT_CLASS_SELECT', classObject)

				// Update students. This is needed to show the little number of requested enrollments in the sidebar
				var self = this
				this.updateStudents()
				.then(function() {
					if (self.role === "professor" || self.role === "administrator")
						self.loadingClasses = false
				})

			},
			createClass() {	
				this.newClass['professorId'] = this.userId
				var self = this
				this.$store.dispatch('createClass', {newClass: this.newClass})
				.then(function(response) {
					if (self.role === 'administrator') {
						self.loadingClasses = true
						self.updateAdminClasses()
						.then(function () {
							self.loadingClasses = false
						})
					}
					else if (self.role === 'professor') {
						self.loadingClasses = true
						self.updateProfessorClasses()
						.then(function () {
							self.loadingClasses = false
						})
					}
					// Select created class
					self.$store.commit('CURRENT_CLASS_SELECT', {
						name: response.data.data.name, 
						id: response.data.data.id, 
						number: response.data.data.number, 
						department: response.data.data.department
					})
				})
				this.newClass = {
					archived: false,
					department: '',
					name: '',
					number: '',
					semester: ''
				}
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
					if (self.role == 'administrator') {
						self.loadingClasses = true
						self.updateAdminClasses()
						.then(function () {
							self.loadingClasses = false
						})
					}
					else if (self.role === 'professor'){
						self.loadingClasses = true
						self.updateProfessorClasses()
						.then(function () {
							self.loadingClasses = false
						})
					}

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
					if (self.role == 'administrator') {
						self.loadingClasses = true
						self.updateAdminClasses()
						.then(function () {
							self.loadingClasses = false
							self.sidebarClassesTab = 'activeClasses'
						})
					}
					else if (self.role === 'professor'){
						self.loadingClasses = true
						self.updateProfessorClasses()
						.then(function () {
							self.loadingClasses = false
							self.sidebarClassesTab = 'activeClasses'
						})
					}

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
			// ASSIGNMENTS
			openAssignmentsModal(){
				this.loadingAssignments = true
				this.modalClassAssignmentsIsOpen = true
				var self = this
				this.updateAssignments()
				.then(function() {
					self.loadingAssignments = false
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
				} else {
					alert('Please complete all assignment fields.')
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
			createCategoriesTreeDataForm() {
				try{
					// Clear out canon children, to get fresh ones from server
					for (var canon = 0; canon < this.canons.length; canon++) {
						this.canons[canon].children = []
					}
					// Loop through server categories
					for (var category = 0; category < this.categories.length; category++) {
						// Search for this category.canon in canons array
						for (var canon = 0; canon < this.canons.length; canon++) {
							if (this.canons[canon].label === this.categories[category].canon){
								// Push this category to the appropriate canon children array
								this.canons[canon].children.push(
									{
										label: this.categories[category].name, 
										desc: this.categories[category].description
									}
								)
							}
						}
					}
				}
				catch (err) {
					console.log("MtSidebar.vue: createCategoriesTreeDataForm error: ", err)
				}
			},
			addNewCategory() {
				console.log("Adding ", this.newCategoryName, "category to ", this.newCategoryCanon, "canon")
				console.log("With description ", this.newCategoryDesc)
				for (var canon = 0; canon < this.canons.length; canon++) {
					if (this.canons[canon].label === this.newCategoryCanon){
						this.canons[canon].children.push(
							{
								label: this.newCategoryName, 
								desc: this.newCategoryName
							}
						)
						this.newCategoryName = ''
						this.newCategoryDesc = ''
						this.newCategoryCanon = ''
					}
				}
			},
			// categoriesListChanged() {
			// 	console.log(this.categoriesCheckList)
			// 	console.log('fetchCategories')
			// },
			handleNodeClick(data) {
				console.log(data);
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
					alert("Enrollment request sent.")
				})
				// .catch(function(err) {
				// 	console.log("requestToEnrollToClass error: ", err)
				// })
			},
			secondsToMMSS(s) {
				s = Number(s);

				var m = Math.floor(s % 3600 / 60);
				var s = Math.floor(s % 3600 % 60);

				return ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
			},
		},
        computed: {
            ...mapGetters(
				['videos', 'classes', 'currentClass',
				 'assignments', 'genres', 'categories', 
				 'enrollments', 'userEnrollments', 'enrolledClasses', // Mainly used for student side of enrollments
				 'classEnrolledStudents', 'classEnrollments', 'users' // Mainly used for admin/professor side of enrollments
				]
            )
		},
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
