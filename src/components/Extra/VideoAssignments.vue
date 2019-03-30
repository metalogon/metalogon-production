<template>
    <div>
        <button class="collaborators button" @click="openModalCollaborators()">
            <i class="fa fa-file-text-o"></i><span>Video Assignment</span>
        </button>

        <el-dialog :title="currentVideo.title + ' Assignment'" v-on:close="closeModalCollaborators()" :visible.sync="modalVideoAssignmentOpen">
            <div class="uploadvid__sync-load" 
                v-loading="loadingModalVideoAssignment" 
                v-show="loadingModalVideoAssignment"
                element-loading-text="Loading..." 
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
            <el-tabs v-model="assignmentsTab" v-if="!loadingModalVideoAssignment">
                <el-tab-pane label="Video Assignment" name="videoAssignment">
                    <el-card shadow="never">
                        Current video assignment: {{currentVideoAssignment.title}}
                    </el-card>
                    <el-card shadow="never" v-if="currentVideoAssignment.title !== 'None'">
                        Description: {{currentVideoAssignment.description}}
                    </el-card>
                    <el-card shadow="never" v-if="currentVideoAssignment.title !== 'None'">
                        <el-date-picker type="date" v-model="currentVideoAssignment.dueDate" :readonly="true"></el-date-picker>
                    </el-card>
                    <!-- <div class="mt-table">
                        <li v-for="(a, ind) in filteredAssignments" :key="a.id" style="list-style:none">
                            <span><i class="fa fa-pencil fa-1x"></i> {{ a.title }}</span>
                        </li>
                    </div> -->
                </el-tab-pane>
                <el-tab-pane label="Class Assignments" name="classAssignments">
                    <el-card shadow="never" v-if="assignments.length === 0" ><i>No class assignments</i></el-card>
                    <el-input icon="search" v-show="assignments.length !== 0" v-model="searchInput" @change="filterAssignmentsArray('assignments', 'filteredAssignments', searchInput)" placeholder="Search for an assignment..." style="width:220px;margin-bottom:7px;" clearable></el-input>
                    <el-table class="mt-table" v-if="assignments.length !== 0" ref="singleTable" :data="filteredAssignments" highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column type="index"></el-table-column>
                        <el-table-column type="select" property="title" label="Title"></el-table-column>
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <p>Description: {{ props.row.description }}</p>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-top: 20px">
                        <el-button v-if="currentRow !== null" @click="saveSelection(currentRow)">Save selection</el-button>
                        <el-button v-if="currentRow === null" disabled>Select an assignment</el-button>
                    </div>
                </el-tab-pane>

            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { mapMutations } from 'vuex'
    
    import { Loading } from 'element-ui';
    
    export default {
        props: ['currentVideo'], 
        data() {
            return {
                modalVideoAssignmentOpen: false,
                loadingModalVideoAssignment: false,
                searchInput: '',
                filteredAssignments: [],
                currentVideoAssignment: {title: 'Loading...'},
                currentRow: null,
                assignmentsTab: 'videoAssignment',
                id:''
            }
        },
        methods: {            
            openModalCollaborators() {
				this.modalVideoAssignmentOpen = true
                this.loadAssignments()	
				
            },     
            closeModalCollaborators() {
                this.loadingModalVideoAssignment = false
                this.searchInput = ''
                this.filteredAssignments = []
                this.currentVideoAssignment = {title: 'Loading...'}
                this.currentRow = null
                this.assignmentsTab = 'videoAssignment'
                this.modalVideoAssignmentOpen = false			
            },

            handleCurrentChange(val) {
                this.currentRow = val;
            }, 

            saveSelection(row) {
                var self = this
                this.$store.dispatch('addAssignmentToVideo', {videoId: this.currentVideo.id, assignmentId: row.id})
                .then(function(){
                    self.loadingInstance = Loading.service({ fullscreen: true });

                    self.id = self.$route.params.id // Get video ID from URL

                    return self.$store.dispatch('getVideo', self.id)
                })
                .then(function() {
                    return self.loadAssignments()
                })
                .then(function() {
                    // return self.$store.dispatch('getAllClasses')
                    self.loadingInstance.close()
                })
            },

            filterAssignmentsArray: _.debounce(function (arrayName, filteredArrayName, filterString) {
                // Filters any assignment array
                // Requires the array's name as string in the first argument and 
                // the filtered array's name as string in the second argument and
                // the search input in the third argument

                // Define the filter method that is used above.
                var filterAssignments = (queryString) => {
                    return (s) => {
                        var name = s.title + " " + s.description 
                        return name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
                    }
                } 

                this[filteredArrayName] = this[arrayName].filter(filterAssignments(filterString))
            }, 500),

            loadAssignments() {
                // To load the assignments, we need the classId from currentClass
                // This is safe because when loading a video, current class changes
                // to the video's class
				this.loadingModalVideoAssignment = true
                var self = this
                this.$store.dispatch('getAssignments', this.currentClass.id)
                .then(function() {
                    for (var a=0; a < self.assignments.length; a++) {
                        if (self.currentVideo.assignmentId == self.assignments[a].id) {
                            self.currentVideoAssignment = self.assignments[a]
                        }
                    }
                    if (self.currentVideoAssignment.title == "Loading...") self.currentVideoAssignment.title = "None"
                    self.filteredAssignments = self.assignments
                    self.loadingModalVideoAssignment = false
                    return
                })
            },
        },
        mounted() {

        },
        computed: {
			...mapGetters(
				[ 'assignments', 'classes', 'currentClass' ]
			)
        },
    }
</script>

<style>
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



</style>