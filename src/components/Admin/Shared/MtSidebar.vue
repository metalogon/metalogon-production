<template>

		<aside class="sidebar column is-2 aside">

			<!-- Sidebar buttons/actions  -->
			<div class="sidebar__actions" v-if="!loadingClasses">
				<a class="sidebar__actionsLink" v-if="role === 'administrator' || role === 'professor'" @click="createNewClassModalOpen();"><i class="fa fa-plus"></i>Create new class</a>
				<a class="sidebar__actionsLink" v-if="role === 'administrator'" @click="modalInviteUserIsOpen = true"><i class="fa fa-plus"></i>Invite a new user</a>
				<a class="sidebar__actionsLink" v-if="role === 'administrator' && (currentClass.name !== 'Home')" @click="modalDeleteClassIsOpen = true"><i class="fa fa-trash"></i>Delete this class</a>
				<a class="sidebar__actionsLink" v-if="(role === 'administrator' || role === 'professor') && !(currentClass.name === 'Home')" @click="openAssignmentsModal()"><i class="fa fa-file-text-o"></i>Assignments</a>
				<a class="sidebar__actionsLink" v-if="(role === 'administrator' || role === 'professor') && !(currentClass.name === 'Home')" @click="modalArchiveClassIsOpen = true"><i class="fa fa-archive"></i>Archive this class</a>
				<a class="sidebar__actionsLink" v-if="(role === 'administrator' || role === 'professor') && !(currentClass.name === 'Home')" @click="toggleModalStudentRequests()"><i class="fa fa-file-text-o"></i>Student requests ({{ requestedStudents.length }})</a>
				<!-- <a class="sidebar__actionsLink" v-if="role === 'administrator' || role === 'professor'" @click="createElementTree(); modalGenreCustomization = true"><i class="fa fa-commenting-o"></i>Categories</a> -->
				<a class="sidebar__actionsLink" v-if="role === 'student'" @click="toggleModalClassesToEnroll()"><i class="fa fa-plus"></i>Find a class to enroll</a>
				<a class="sidebar__actionsLink" v-if="role === 'student' && (currentClass.name !== 'Home')" @click="openAssignmentsModal()"><i class="fa fa-file-text-o"></i>Class Assignments</a>
			</div>

			<!-- Sidebar Classes menu for student -->
			<div class="sidebar__classes" v-if="role === 'student'">	
				<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingClasses" 
					v-if="loadingClasses"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
				<!-- The two lines below don't show if the acceptedClasses array is empty, so there is no need for a v-if="!loadingClasses" -->
				<el-input class="sidebar__classesInput" v-if="acceptedClasses.length !== 0" icon="search" v-model="searchInputClassSidebar" @change="filterClassArray('acceptedClasses', 'filteredAcceptedClasses', searchInputClassSidebar)" placeholder="Search for a class..."></el-input>
				<a class="sidebar__classesLink" v-for="c in filteredAcceptedClasses" :class="{ 'is-bg-light' : (currentClass.name === c.name) }"  :key="c.id" @click="setCurrentClass(c)">{{ c.number }} - {{ c.name }}</a>
			</div>

			<!-- Sidebar Classes menu for administrator-->
			<div class="sidebar__classes" v-if="role === 'administrator'">
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
			
			<!-- Sidebar Classes menu for professor-->
			<div class="sidebar__classes" v-if="role === 'professor'">
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
							<i v-if="professorActiveClasses.length === 0"> &nbsp;&nbsp; No classes - create one </i>
							<el-input class="sidebar__classesInput" v-if="professorActiveClasses.length !== 0" icon="search" v-model="searchInputActiveClassSidebar" @change="filterClassArray('professorActiveClasses', 'filteredProfessorActiveClasses', searchInputActiveClassSidebar)" placeholder="Search for a class..."></el-input>
							<a class="sidebar__classesLink" v-for="c in filteredProfessorActiveClasses" :class="{ 'is-bg-light' : (currentClass.name === c.name) }" :key="c.id" @click="setCurrentClass(c)">{{ c.number }} - {{ c.name }}</a>
						</div>
					</el-tab-pane>
					<el-tab-pane label="Archived" name="archivedClasses">
						<div class="sidebar__classes">
							<i v-if="professorArchivedClasses.length === 0"> &nbsp;&nbsp; No archived classes </i>
							<el-input class="sidebar__classesInput" v-if="professorArchivedClasses.length !== 0" icon="search" v-model="searchInputArchivedClassSidebar" @change="filterClassArray('professorArchivedClasses', 'filteredProfessorArchivedClasses', searchInputArchivedClassSidebar)" placeholder="Search archived classes..."></el-input>							
							<a class="sidebar__classesLink" v-for="c in filteredProfessorArchivedClasses" :key="c.id" :class="{ 'is-bg-light' : (currentClass.name === c.name) }" @click="openModalUnarchiveClass(c.id)">{{ c.number }} - {{ c.name }}</a>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>

			<!-- administrator, professor -->
			<el-dialog title="Add new class" :visible.sync="modalCreateClassIsOpen" :before-close="handleNewClassClose">
				<el-steps :active="createModalActive" finish-status="success" space="97%">
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
						<el-tree :data="elementTreeForm" :props="genreProps" @check-change="handleCheckChange" show-checkbox ref='elementTreeRef' node-key='id'></el-tree>
					</div>
				</div>
				<!-- /Second Step -->

				<span slot="footer" class="dialog-footer">
					<el-button v-if="createModalActive == 0" style="float:left;" @click="handleNewClassClose">Cancel</el-button>
					<el-button v-if="createModalActive == 0" class="add-class-btn" @click="nextStep">Next Step</el-button>
					<el-button v-if="createModalActive == 1" style="float:left;" @click="previousStep">Previous Step</el-button>
					<el-button v-if="createModalActive == 1" class="add-class-btn" @click="createClass(); modalCreateClassIsOpen = false;">Create Class</el-button>
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

			<!-- <el-dialog title="Categories customization" :visible.sync="modalGenreCustomization" size="large">
				<h3 style="margin-bottom:10px;">Choose genre:</h3>
				<el-select v-model="currentGenre" placeholder="Choose a genre" style="width:300px">
					<el-option v-for="g in genres" :key="g.name" :label="g.name" :value="g.name"></el-option>
				</el-select>
				<br>
				<el-button v-if="currentGenre !== ''" style="margin-top:10px" @click="modalAddCategoryIsOpen = true"> Add category</el-button>
				<el-radio class="radio" v-model="currentGenre" v-for="g in genres" :key="g.name" :label="g.name"></el-radio>

				<br/>
				<br/>
				<div v-if="currentGenre">
					<p>Choose canons:</p>
					<el-tree :data="canons" :props="genreProps" @node-click="handleNodeClick" show-checkbox>
					</el-tree>
				</div>
				
				<span slot="footer" class="dialog-footer">
						<el-button @click="modalGenreCustomization = false; currentGenre = ''">Close</el-button>
				</span>
			</el-dialog>	 -->

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

			<!-- Administrator/Professor - Assignments -->
			<el-dialog v-bind:title="this.currentClass.name + ' Class assignments'" :visible.sync="modalClassAssignmentsIsOpen" class="modal-class-assignments" v-if="!!currentClass.id && (role === 'administrator' || role ==='professor')">
				<!-- Loading Screen -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingAssignments" 
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"></div>
                <el-tabs v-show="!loadingAssignments">
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

			<!-- Student - Assignments -->
			<el-dialog v-bind:title="this.currentClass.name + ' Class assignments'" :visible.sync="modalClassAssignmentsIsOpen" class="modal-class-assignments" v-if="!!currentClass.id && 	role === 'student'">
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
										<p class="assignments__titleText_noEdit" v-if="role === 'student'">{{ a.title }}</p>
									</span>
									<hr>
									<span class="assignments__desc">
										<strong class="assignments__descTitle">Description:</strong>
										<span class="assignments__descId">{{ a.id }}</span>
										<!-- Simple viewing for student -->
										<p class="assignments__titleText_noEdit" v-if="role === 'student'">{{ a.description }}</p>
									</span>
									<hr>
									<span class="assignments__genre" v-for="g in genres" v-if="g.id === a.genre" :key="g.id">
										<strong class="assignments__genreTitle">Genre:</strong> 
										<span class="assignments__genreId">{{ a.id }}</span>
										<!-- Simple viewing for student -->
										<p class="assignments__genreName__noEdit" v-if="role === 'student'">{{ g.name }}</p>
									</span>
									<hr>
									<span class="assignments__dueDate">
										<strong class="assignments__dueDateTitle">Due date:</strong>
										<span class="assignments__dueDateId">{{ a.id }}</span>
										<p>
											<!-- Simple viewing for student -->
											<el-date-picker type="date" placeholder="Pick a date" v-if="role === 'student'" v-model="a.dueDate" :readonly="true"></el-date-picker>
										</p>
									</span>
								</div>
							</el-tab-pane>
							<el-tab-pane label="My Submission" name="MySubmission">
								<mt-video-itemlist v-for="v in userCollaborated" v-bind:key="v.id" :currentVideo="v" v-if="v.assignmentId === a.id" :enableStatistics="false"></mt-video-itemlist>
							</el-tab-pane>
							<el-tab-pane label="Class Submissions" name="ClassSubmissions">
								<mt-video-itemlist v-for="v in videosWithoutUserSubs" v-bind:key="v.id" :currentVideo="v" v-if="v.assignmentId === a.id" :enableStatistics="false"></mt-video-itemlist>
							</el-tab-pane>
                		</el-tabs>
						
                    </el-tab-pane>
                </el-tabs>
				<p v-if="assignments.length === 0 && role === 'student' && !loadingAssignments" ><i>No assignments</i></p>
            </el-dialog>
	
			<!-- Administrator/Professor - Student requests -->
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
								<el-button v-if="role === 'administrator'" size="small" type="info" @click="deleteEnrollment(index, s)" style="float: right; margin: -2px;">Unenroll</el-button>
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
								<el-button v-if="role === 'administrator'" size="small" type="info" @click="deleteRequest(index, s)" style="float: right; margin:-2px;">Delete request</el-button>
								<el-button size="small" type="info" @click="acceptStudent(index, s)" style="float: right; margin: -2px; margin-right: 5px">Accept request</el-button>
							</li>
						</div>
                        <el-button v-if="requestedStudents.length !== 0" sfize="small" type="info" @click="acceptAllStudents()" style="margin-top: 5px;">Accept all requests</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="Other students" name="otherStudents" v-if="role === 'administrator'">
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
            </el-dialog>	 -->
		</aside>

</template>

<script>
	import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
	import _ from 'lodash'
	import MtVideoItemList from './MtVideoItemList.vue'
    
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
				modalClassAssignmentsIsOpen: false,
				// Student
				modalClassesToEnrollIsOpen: false,
				videosWithoutUserSubs: [], // List of all class videos for current assignment
				// Professor, Administrator
				modalCreateClassIsOpen: false,
				createModalActive: 0,
				modalArchiveClassIsOpen: false,
				modalUnarchiveClassIsOpen: false,
				modalStudentRequestsIsOpen: false,
				// Administrator
				modalDeleteClassIsOpen: false,
				modalInviteUserIsOpen: false,

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
				assignmentsModalSubtab: 'General',
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
				previousGenre: '',
				firstTimeSelectingGenre: true,
				modalGenreCustomization: false,
				modalAddCategoryIsOpen: false,
				newCategoryCanon: "",
				newCategoryName: "",
				newCategoryDesc: "",
				// Categories customization
				localTrees: [], // Data structure that contains a customized tree for each genre
				elementTreeForm: [], // Data structure for the element library to read from
				genreProps: {
					children: 'children',
					label: 'label',
					desc: 'desc',
					checked: 'checked',
					indeterminate: 'indeterminate'
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
			handleGenreSelection() {
				if (this.firstTimeSelectingGenre) {
					this.previousGenre = this.currentGenre
					this.firstTimeSelectingGenre = false
				}
				else {
					console.log("customizeLocalTreeFromElTree with genre:", this.previousGenre)
					this.customizeLocalTreeFromElTree(this.previousGenre)
				}
				console.log("creating basic element tree from:", this.canons)
				this.createElementTree(this.canons)
				console.log("currentGenre: ", this.currentGenre, " - previous: ", this.previousGenre)
				this.previousGenre = this.currentGenre
				
			},
			createNewClassModalOpen() {
				var self = this
				// Initialize the local cat filters, etc
				this.$store.dispatch('getCanons')
				.then(function() {
					return self.$store.dispatch('getGenres')
				})
				.then(function() {
					// Initialize localTrees with objects. Each object corresponds to a genre from the backend.
					// Contains genre name and id, plus the tree for this genre
					for (var g = 0; g < self.genres.length; g++) {
						self.localTrees.push({
							genreName: self.genres[g].name,
							genreId: self.genres[g].id,
							// tree defaults to the basic tree from the backend
							// This is done for deep copying of the values instead of references
							// tree: JSON.parse(JSON.stringify(self.canons)) // TODO this is probably bad
							tree: []
						})
						var ltGenLen = self.localTrees.length
						// Add tree, deep copying manually and converting to array
						for (var canonName in self.canons) {
							var canonObject = self.canons[canonName]
							// Add new canon
							self.localTrees[ltGenLen - 1].tree.push({
								categories: [],
								name: canonObject.name
							})
							var ltTreeLen = self.localTrees[ltGenLen - 1].tree.length
							for (var catName in canonObject.categories) {
								var catObject = canonObject.categories[catName]
								self.localTrees[ltGenLen - 1].tree[ltTreeLen - 1].categories.push({
									canon: canonObject.name,
									description: catObject.description,
									id: catObject.id,
									name: catObject.name,
									subcategories: []
								})
								var ltTreeCatLen = self.localTrees[ltGenLen - 1].tree[ltTreeLen - 1].categories.length
								if (catObject.subcategories.length != 0) { // This category has subcategories
									for (var subcatName in catObject.subcategories) {
										var subcatObject = catObject.subcategories[subcatName]
										self.localTrees[ltGenLen - 1].tree[ltTreeLen - 1].categories[ltTreeCatLen - 1].subcategories.push({
											canon: subcatObject.canon,
											description: subcatObject.description,
											id: subcatObject.id,
											name: subcatObject.name,
											parentId: subcatObject.parentId,
										})
									}
								}
							}
						}
					}
				})
				.then(function() {
					self.modalCreateClassIsOpen = true
				})
			},
			setCheckedTreeNodes(){
				// for (var canonName in this.elementTreeForm) {
				// 	var canonObject = this.elementTreeForm[canonName]
				// 	// console.log(this.elementTreeForm[canonName].label)
				// 	// console.log(this.$refs.elementTreeRef)
				// 	this.$refs.elementTreeRef.setChecked({
				// 		label: canonObject.label,
				// 		desc: canonObject.desc,
				// 		checked: canonObject.checked,
				// 		indeterminate: canonObject.indeterminate,
				// 		children: canonObject.children
				// 	})
        		// 	// console.log(this.$refs.elementTreeRef.getCheckedNodes());
					
				// 	for (var catName in this.elementTreeForm[canonName].children) {
				// 		var catObject = canonObject.children[catName]
				// 		this.$refs.elementTreeRef.setChecked({
				// 			label: catObject.label
				// 		})
				// 		for (var subcatName in catObject.children) {
				// 			var subcatObject = catObject.children[subcatName]
				// 			this.$refs.elementTreeRef.setChecked({
				// 				label: subcatObject.label
				// 			})
				// 		}
				// 	}
				// }
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
			handleNewClassClose() { //(done) {
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
			// Administrator
			createInvitation() {
				if (this.invitation.email === '' || this.invitation.role === '') {
					alert("Please complete all the fields.")
				}
				else if (this.invitation.email != this.repeatEmail) {
					alert("Please repeat e-mail address correctly.")
				}
				else {
					this.secureHTTPService.post("invitation", this.invitation)
					.then(function (response) {
						// console.log(response)
						alert("Invitation code: " + response.data.data.id)
					})
					.catch(function (err) {
						console.log("Error while posting invitation: ", err)
						alert("Something went wrong.")
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
				this.newClass.catFilter = this.localTrees
				this.newClass['professorId'] = this.userId
				var self = this
				// console.log("Now POSTing new class to server:", this.newClass)
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
						department: response.data.data.department,
						catFilter: response.data.data.catFilter
					})
				})
				// console.log("Current class after post:", this.currentClass)
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
			createElementTree(tree) {
				// Create the element tree from the given tree
				// console.log(this.currentGenre)
				// var genreIndex = 0
				// for (var g = 0; g < this.genres.length; g++) {
				// 	if (this.localTrees[g].genreName === this.currentGenre) {
				// 		genreIndex = g
				// 		break
				// 	}
				// }
				console.log("creating element tree from:", tree)
				// Clear out elementTreeForm to get fresh ones
				this.elementTreeForm = []
				// Loop through given tree's canons
				for (var canon in tree) {
					// console.log(tree[canon])
					// Add canon
					this.elementTreeForm.push({
						label: canon,
						id: '', //tree[canon].id, // doesnt exist on backend
						desc: '',
						children: []
					})						
					// Add canon description, if one exists
					if (tree[canon].description) {
						this.elementTreeForm[this.elementTreeForm.length - 1].desc = 
							tree[canon].description
					}
					// Loop through this canon's categories
					for (var cat in tree[canon].categories) {
						// console.log(tree[canon].categories[cat])
						// Add canon's category
						this.elementTreeForm[this.elementTreeForm.length - 1].children.push({
							label: tree[canon].categories[cat].name,
							id: tree[canon].categories[cat].id,
							desc: '', 
							children: []
						})
						// Add category's description, if one exists
						if (tree[canon].categories[cat].description) {
							this.elementTreeForm[this.elementTreeForm.length - 1].children[this.elementTreeForm[this.elementTreeForm.length - 1].children.length - 1].desc = 
								tree[canon].categories[cat].description
						}
						// Loop through this category's subcategories if there are any
						for (var subCat in tree[canon].categories[cat].subcategories) {
							// console.log(tree[canon].categories[cat].subcategories[subCat])
							// Add subcategory
							this.elementTreeForm[this.elementTreeForm.length - 1].children[this.elementTreeForm[this.elementTreeForm.length - 1].children.length - 1].children.push({
								label: tree[canon].categories[cat].subcategories[subCat].name,
								id: tree[canon].categories[cat].subcategories[subCat].id,
								desc: '',
								//children: [] //sub-subcategories
							})
							// Add subcategory's description, if one exists
							if (tree[canon].categories[cat].subcategories[tree[canon].categories[cat].subcategories.length - 1].description) {
								this.elementTreeForm[this.elementTreeForm.length - 1].children[this.elementTreeForm[this.elementTreeForm.length - 1].children.length - 1].children[this.elementTreeForm[this.elementTreeForm.length - 1].children[this.elementTreeForm[this.elementTreeForm.length - 1].children.length - 1].children.length - 1].desc = 
									tree[canon].categories[cat].subcategories[subCat].description
							}
							// More subcategories/children can be added here
						}
					}
				}
			},
			customizeLocalTreeFromElTree(gen) {
				// Get checked data from elementTree and save the customized trees to localTree for genre 'gen'
				var checkedNodesArray = this.$refs.elementTreeRef.getCheckedNodes()
				console.log(this.$refs.elementTreeRef.getCheckedNodes());
				
				console.log("Getting customized tree")
				var genreIndex = 0
				for (var i = 0; i < this.localTrees.length; i++) {
					if (this.localTrees[i].genreName == gen) {
						genreIndex = i
						break
					}
				}
				console.log("Genre index:",genreIndex)
				console.log("localtrees[genreIndex]:", this.localTrees[genreIndex])
				for (var canonName in this.localTrees[genreIndex].tree) {
					var canonObject = this.localTrees[genreIndex].tree[canonName]
					// console.log(canonObject)
					for (var i = 0; i < canonObject.categories.length; i ++) {
						var catObject = canonObject.categories[i]
						// console.log(catObject)

						if (catObject.subcategories.length != 0) {
							for (var j = 0; j < catObject.subcategories.length; j ++) {
								var subcatObject = catObject.subcategories[j]
								var found = false
								// console.log("searching for ", subcatObject.name)
								for (var checkedNodeName in checkedNodesArray) {
									if (checkedNodesArray[checkedNodeName].id == subcatObject.id) {
										found = true
										// console.log("found ", checkedNodesArray[checkedNodeName].name)
									}
								}
								if (!found) {
									// console.log("deleting ", subcatObject.name)
									catObject.subcategories.splice(j, 1)
									j--
								}

							}
						}
						else {
							var found = false
							// console.log("searching for ", catObject.name)
							for (var checkedNodeName in checkedNodesArray) {
								if (checkedNodesArray[checkedNodeName].id == catObject.id) {
									found = true
									// console.log("found ", checkedNodesArray[checkedNodeName].name)
								}
							}
							if (!found) {
								// console.log("deleting ", catObject.name)
								canonObject.categories.splice(i, 1)
								i--
							}
						}
					}
				}
				// Clean up canons with no children categories
				for (var i = 0; i < this.localTrees[genreIndex].tree.length; i ++) {
					if (this.localTrees[genreIndex].tree[i].categories.length == 0) {
						this.localTrees[genreIndex].tree.splice(i, 1)
						i --
					}
				}
				// This code handles Invention's categories clean up
				// TODO This is not dynamic. If new canons with subcats are added, this needs to be changed!
				for (var i = 0; i < this.localTrees[genreIndex].tree.length; i ++) {
					if (this.localTrees[genreIndex].tree[i].name == "Invention") {
						for (var j = 0; j < this.localTrees[genreIndex].tree[i].categories.length; j++) {
							if (this.localTrees[genreIndex].tree[i].categories[j].subcategories.length == 0) {
								this.localTrees[genreIndex].tree[i].categories.splice(j, 1)
								j--
							}
						}
						if (this.localTrees[genreIndex].tree[i].categories.length == 0) {
							this.localTrees[genreIndex].tree.splice(i, 1)
						}
					}
				}
				console.log("Saved tree:", this.localTrees[genreIndex].tree)
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
			handleCheckChange(data, checked, indeterminate) {
				// console.log(data, checked, indeterminate);
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
				 'classEnrolledStudents', 'classEnrollments', 'users', // Mainly used for admin/professor side of enrollments
				 'userCollaborated', 'canons'
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
</style>
