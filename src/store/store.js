import Vue from 'vue'
import Vuex from 'vuex'
import secureHTTPService from '../services/SecureHttpService'
import authService from '../services/AuthService'

Vue.use(Vuex)

import { Loading } from 'element-ui';
let loadingInstance = Loading.service({ fullscreen: true });
const restapi = ''   

let errorHTML = `
<div style="padding-top:50px;">
    <h1 style="font-size:28px">We couldn't load the presentation videos</h1>
    <p style="padding-top:5px; font-size:18px">Please contact your administrator</p>
</div>
`

export const store = new Vuex.Store({
    state: {
        videos: [],
        videoAnnotations: [], //  /viewannotation
        classes: [],
        canons: {}, //  /tree
        categories: [], //  /category
        genres: [],
        departments: [],
        // The currently selected class 
        currentClass: { 
            name:'', 
            id: '',
            number: '',
            department: '',
            professorId: ''
        },
        currentVideoID: null,
        uploadingVideo: false,
        uploadUrl: '',
        assignments: [],
        users: [],

        // COLLABORATIONS
        allCollaborations: [],   // All the collaborations of MT (collaboration resource)
        // For video
        videoCollaborations: [], // Video collaborations         (collaboration resource)
        videoCollaborators: [],  // Video collaborators          (users resource)
        // For user
        userCollaborations: [],  // User collaborations          (collaboration resource)
        userCollaborated: [],    // User collaborated videos     (video resource)

        // ENROLLMENTS
        enrollments: [],           // All enrollments
        // For administrator/professor
        classEnrolledStudents: [], // Current class enrolled students (both accepted/not accepted)
        classEnrollments: [],      // Current class enrollments (both accepted/not accepted)
        // For Student
        userEnrollments: [],       // Current student's enrollments
        enrolledClasses: []        // Current student's classes (both accepted/not accepted)
    },

    actions: {
        /* VIDEOS  */
        getAllVideos: function ({ commit }) {
            return secureHTTPService.get("video")
            .then(function (response)
            {
                commit('GET_ALL_VIDEOS', response.data.data )
            })
            .catch(function (err) {
                $('.home').html(errorHTML)
            })
        },
        getVideo: function ({ commit }, payload) {
            return secureHTTPService.get("video/" + payload)
            .then(function (response)
            {
                commit('GET_VIDEO', response.data.data)
            })
            .catch(function (err) {
                $('.video').html(errorHTML)
            })
        },
        createVideo: function ({ commit, dispatch }, payload) {
            return secureHTTPService.post("video", payload)
                .then( response => {
                    // console.log('-----')
                    // console.log('POST video')
                    commit('CREATE_VIDEO', response.data.data)
                    dispatch( 'createCollaboration', { videoId: response.data.data.id, userId: authService.getAuthData().userId } )
                })
                .catch( response => {
                    console.log('createVideo action error.')
                    console.log('payload: ', payload)
                    console.log('error:', response.error)
                })
        },
        editVideo: function ({ commit }, payload) {
            secureHTTPService.put("video/" + payload.videoId, payload.videoBody)
                .then( response => {
                    console.log('PUT video')
                    commit('EDIT_VIDEO', payload.videoBody)
                })
                .catch( function(err) {
                    console.log(err)
                    console.log('videoBody: ', payload.videoBody)
                })
        },
        deleteVideo: function ({ commit }, payload) {
            secureHTTPService.delete("video/" + payload)
                .then( response => {
                    // console.log('-----')
                    // console.log('DELETE video')
                    // console.log(response)
                    // console.log(payload)
                    commit('DELETE_VIDEO', payload)
                })
                .then( response => {
                    // TODO delete annotations of video
                    // TODO delete collaborations of video
                    // TODO delete jwvideo
                })
                .catch(function (err) {
                    console.log('deleteVideo DELETE error: ', err)
                })
        },
        featureVideo: function ({ commit }, payload) {
            secureHTTPService.put("video/" + payload.id, payload)
                .then( response => {
                    // console.log("store.js: Video object that sent: ", payload)
                    // console.log(response)
                })
                .catch( response => console.log(response.error))
        },
        featureGlobal: function ({ commit }, payload) {
            secureHTTPService.put("video/" + payload.id, payload)
                .then( response => {
                    // console.log("store.js: Video object that sent: ", payload)
                    // console.log(response)
                })
                .catch( response => console.log(response.error))
        },
        unfeatureGlobal: function ({ commit }, payload) {
            secureHTTPService.put("video/" + payload.id, payload)
                .then( response => {
                    // console.log("store.js: Video object that sent: ", payload)
                    // console.log(response)
                })
                .catch( response => console.log(response.error))
        },
        unfeatureVideo: function ({ commit }, payload) {
            secureHTTPService.put("video/" + payload.id, payload)
            .then( response => {
                // console.log("store.js: Video object that sent: ", payload)
                // console.log(response)
            })
            .catch( response => console.log(response.error))
        },
        /* ANNOTATIONS */
        getVideoAnnotations: function ({ commit, state }, payload) {
            return secureHTTPService.get("viewannotation?videoId=" + payload)
            .then(function (response)
            {
                // console.log(response.data.data)
                commit( 'GET_VIDEO_ANNOTATIONS', response.data.data )
                state.videoAnnotations.sort(function(a,b) {return (a.from > b.from) ? 1 : ((b.from > a.from) ? -1 : 0);} );
            })
            .catch(function (err) {
                console.log('getVideoAnnotations GET err: ', err)
            })
        },
        addAnnotation: function ({dispatch, commit, state }, payload) {
            secureHTTPService.post("annotation?videoId=" + payload.videoId, payload)
                .then(response => {
                    dispatch('getVideoAnnotations', payload.videoId)
                })
                .catch(function (err) {
                    console.log('Error annotation add...', err)
                })
        },
        editAnnotation: function ({ commit }, payload) {            
            secureHTTPService.put("annotation/" + payload.annotationId, payload.body)
                .then(response => {
                    commit('EDIT_ANNOTATION', payload)
                })
                .catch(function (err) {
                    console.log('Error annotation edit...', err)
                })
        },
        deleteAnnotation: function ({ commit }, payload) {           
            secureHTTPService.delete("annotation/" + payload) // payload is the cardID
                .then(response => {
                    commit('DELETE_ANNOTATION', payload)
                    // theVideo.annotations.sort(function(a,b) {return (a.from > b.from) ? 1 : ((b.from > a.from) ? -1 : 0);} );                    
                })
                .catch(function (err) {
                    console.log('Error annotation delete...', err)
                })
        },
        /* CLASSES */  
        getAllClasses: function ({ commit }) {
            return secureHTTPService.get("class/")
                .then(function (response)
                {
                    // console.log("getAllClasses action")
                    commit('GET_ALL_CLASSES', response.data.data)
                    commit('FILL_DEPARTMENTS')
                })
                .catch(function (err) {
                    $('.classes').html(errorHTML)
                })
        },
        createClass: function ({ commit }, payload) {
            return secureHTTPService.post("class/", payload.newClass)
            .then(response => {
                commit('CREATE_CLASS', response.data.data)
                return response
            })
            .catch(function (err) {
                console.log('createClass POST error: ', err)
            })
        },
        deleteClass: function ({ commit }, payload) {
            return secureHTTPService.delete("class/" + payload)
            .then(response => {
                commit('DELETE_CLASS', payload)
            })
            .catch(function (err) {
                console.log('deleteClass DELETE error: ', err)
            })
        },
        archiveClass: function ({ commit }, payload) {
            return secureHTTPService.put("class/" + payload.classId, payload.classObject)
            .then(response => {
                // pass through
            })
            .catch(function (err) {
                console.log('archiveClass PUT error: ', err)
            })
        },
        unArchiveClass: function ({ commit }, payload) {
            return secureHTTPService.put("class/" + payload.classId, payload.classObject)
            .then(response => {
                // pass through
            })
            .catch(function (err) {
                console.log('unarchiveClass PUT error: ', err)
            })
        },
        /* ENROLLMENTS */ 
        createEnrollment: function ({ commit }, payload) {
            return secureHTTPService.post("enrollment", payload)
            .then(function(response){
                // console.log("Create enrollment payload: ", payload)
                // console.log(response.data.data)
                commit('CREATE_ENROLLMENT', response.data.data)
            })
            .catch(function(err) {
                console.log("createEnrollment POST error: ", err)
            })
        },
        editEnrollment: function ({ commit }, payload) {
            return secureHTTPService.put("enrollment/" + payload.id, payload)
            .then(function(response){
                commit('EDIT_ENROLLMENT', response.data.data)
            })
            .catch(function(err) {
                console.log("editEnrollment PUT error: ", err)
            })
        },
        deleteEnrollment: function ({commit}, payload) {
            return secureHTTPService.delete("enrollment/" + payload)
            .then(function(response) {
                // console.log("Delete enrollment payload: ", payload)
                // console.log(response.data.data)
                commit('DELETE_ENROLLMENT', payload)
            })
            .catch(function(err) {
                console.log("deleteEnrollment DELETE error: ", err)
            })
        },
        getAllEnrollments: function ({ commit }, payload) {
            return secureHTTPService.get("enrollment")
            .then(function(response) {
                // console.log("getAllEnrollments action")
                commit('GET_ENROLLMENTS', response.data.data)
            })
            .catch(function (err) {
                console.log('getAllEnrollments GET error: ', err)
            })
        },
        getAllUserEnrollmentsByUserId: function ({ commit }, payload) {
            return secureHTTPService.get("enrollment?userId=" + payload)
            .then(function(response) {
                commit('GET_USER_ENROLLMENTS', response.data.data)
            })
            .catch(function (err) {
                console.log('getAllUserEnrollmentsByUserId GET error: ', err)
            })
        },
        getEnrolledClassesByUserId: function ({ commit }, payload) {
            return secureHTTPService.get("enrolledClass?userId=" + payload)
            .then(function(response) {
                // console.log("getEnrolledClassesByUserId action")
                commit('GET_ENROLLED_CLASSES', response.data.data)
            })
            .catch(function (err) {
                console.log('getEnrolledClassesByUserId GET error: ', err)
            })
        },
        getEnrolledUsersByClassId: function ({ commit }, payload) {
            return secureHTTPService.get("enrolledUser?classId=" + payload)
            .then(function(response) {
                commit('GET_ENROLLED_STUDENTS_BY_CLASSID', response.data.data)
            })
            .catch(function (err) {
                console.log('getEnrolledUsersByClassId GET error: ', err)
            })
        },
        getEnrollmentsByClassId: function ({ commit }, payload) {
            return secureHTTPService.get("enrollment?classId=" + payload)
            .then(function(response) {
                // console.log(response.data.data)
                commit('GET_ENROLLMENTS_BY_CLASS_ID', response.data.data)
            })
            .catch(function (err) {
                console.log('getEnrollmentsByClassId GET error: ', err)
            })
        },
        /* ASSIGNMENTS */ 
        getAssignments: function ({ commit }, payload) {
            return secureHTTPService.get("assignment?classId=" + payload)
            .then(function (response)
            {
                commit('GET_ASSIGNMENTS', response.data.data)
            })
            .catch(function (err) {
                console.log('getAssignments GET error: ', err)
            })
        },
        createAssignment: function ({ commit }, payload) {
            return secureHTTPService.post("assignment", payload)
            .then(function (response)
            {
                commit('CREATE_ASSIGNMENT', response.data.data)
            })
            .catch(function (err) {
                console.log('createAssignment POST error: ', err)
            })
        },
        editAssignment: function ({ commit }, payload) {
            console.log('editAssignment()')
            console.log(payload.assignment)
            secureHTTPService.put("assignment/" + payload.id, payload.assignment)
                .then(function (response)
                {
                    console.log(response)
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        deleteAssignment: function ({ commit }, payload) {
            secureHTTPService.delete("assignment/" + payload)
                .then(function (response)
                {
                    commit('DELETE_ASSIGNMENT', payload)
                })
                .catch(function (err) {
                    
                })
        },
        /* GENRES */ 
        getGenres: function ({ commit }) {
            secureHTTPService.get("genre")
                .then(function (response)
                {
                    commit('GET_GENRES', response.data.data)
                })
                .catch(function (err) {
                    
                })
        },
        /* CANONS */ 
        getCanons: function ({ commit }) {
            return secureHTTPService.get("tree")
            .then(function (response)
            {
                commit('GET_CANONS', response.data.data)
            })
            .catch(function (err) {
                console.log('getCanons GET err: ', err)
            })
        },
        /* CATEGORIES */ 
        getCategories: function ({ commit }) {
            secureHTTPService.get("category")
                .then(function (response)
                {
                    commit('GET_CATEGORIES', response.data.data)
                })
                .catch(function (err) {
                    
                })
        },
        /* COLLABORATORS */
        getAllCollaborations: function({commit}) {
            return secureHTTPService.get("collaboration")
            .then(function(response) {
                commit('GET_ALL_COLLABORATIONS', response.data.data)
                // console.log("Updated store allCollaborations")
                // console.log("Response: ", response)
            })
            .catch(function(err) {
                console.log('getAllCollaborations GET error: ', err) 
            })
        },
        getCollaborationsByVideoId: function({commit}, payload) {
            // Filters collaboration resource by video id
            return secureHTTPService.get("collaboration?videoId=" + payload)
            .then(function(response) {
                commit('GET_COLLABORATIONS_BY_VIDEO_ID', response.data.data)
                // console.log("Updated store videoCollaborations for videoId: ", payload)
                // console.log("Response: ", response)
            })
            .catch(function(err) {
                console.log('getCollaborationsByVideoId GET error: ', err) 
            })
        },
        getCollaboratorsByVideoId: function({commit}, payload) {
            // Uses collaborator join
            return secureHTTPService.get("collaborator?videoId=" + payload)
            .then(function(response) {
                commit('GET_COLLABORATORS_BY_VIDEO_ID', response.data.data)
                // console.log("Updated store videoCollaborators for videoId: ", payload)
                // console.log("Response: ", response)
            })
            .catch(function(err) {
                console.log('getCollaboratorsByVideoId GET error: ', err) 
            })
        },
        getCollaborationsByUserId: function({commit}, payload) {
            // Filters collaboration resource by user id
            return secureHTTPService.get("collaboration?userId=" + payload)
            .then(function(response) {
                commit('GET_COLLABORATIONS_BY_USER_ID', response.data.data)
                // console.log("Updated store userCollaborations for userId: ", payload)
                // console.log("Response: ", response)
            })
            .catch(function(err) {
                console.log('getCollaborationsByUserId GET error: ', err) 
            })
        },
        getCollaboratedVideosByUserId: function({commit}, payload) {
            // Users collaborated join
            return secureHTTPService.get("collaborated?userId=" + payload)
            .then(function(response) {
                commit('GET_COLLABORATED_VIDEOS_BY_USER_ID', response.data.data)
                // console.log("Updated store userCollaborated for userId: ", payload)
                // console.log("Response: ", response)
            })
            .catch(function(err) {
                console.log('getCollaboratedVideosByUserId GET error: ', err) 
            })
        },
        createCollaboration: function ({ commit, dispatch }, payload) {
            return secureHTTPService.post("collaboration", payload)
            .then(function (response)
            {
                // console.log("Created collaboration for payload: ", payload)
                // console.log("Response: ", response)
            })
            .catch(function(err) {
                console.log('createCollaboration POST error: ', err) 
            })
        },
        deleteCollaboration: function ({ commit, dispatch, state }, payload) {
            return dispatch('getCollaborationsByUserId', payload.userId)
            .then(function (response)
            {
                for (var i = 0, l = state.userCollaborations.length; i < l; i++) {
                    if (state.userCollaborations[i].videoId === payload.videoId && state.userCollaborations[i].userId === payload.userId) {
                        return secureHTTPService.delete("collaboration/" + state.userCollaborations[i].id)
                        .then(function (response)
                        {
                            // console.log('deleted collaboration: ', response)
                        })
                        .catch(function(err) {
                            console.log('deleteCollaboration DELETE error: ', err)
                        })
                    }
                } 
            })
        },
        /* USERS */ 
        getUsers: function ({ commit }, payload) {
            secureHTTPService.get("user")
                .then(function (response)
                {
                    commit('GET_USERS', response.data.data)
                })
                .catch(function (err) {
                    
                })
        }
    },

    mutations: {
        /* VIDEOS */
        GET_ALL_VIDEOS: (state, newVideos) => {
            loadingInstance.close()
            state.videos = newVideos
            state.videos.sort(function(a,b) {return (a.presentedAt < b.presentedAt) ? 1 : ((b.presentedAt < a.presentedAt) ? -1 : 0);} );
            for (var i = 0, l = state.videos.length; i < l; i++) {
                Vue.set(state.videos[i], 'featured', false)
            }
        },
        GET_VIDEO: (state, video) => {
            loadingInstance.close()
            state.videos = video
        },
        CREATE_VIDEO: (state, payload) => {
            var videos = state.videos
            videos.push(payload)
        },
        EDIT_VIDEO: (state, payload) => {
            state.videos.link = payload.link
            state.videos.duration = payload.duration
            state.videos.status = payload.status
        },
        DELETE_VIDEO: (state, videoId) => {
            for (var i=0, l = state.videos.length; i < l; i++) {
                if (state.videos[i].id === videoId)
                    try {
                        state.videos.splice(i, 1)            
                    }
                    catch(err) {
                        console.log(err)
                    }
            }
        },
        /* ANNOTATIONS */
        GET_VIDEO_ANNOTATIONS: (state, newAnnotations) => {
            state.videoAnnotations = newAnnotations
        },
        ADD_ANNOTATION: (state, payload) => {
            state.videoAnnotations.push(payload)
        },
        EDIT_ANNOTATION: (state, payload) => {
            for (var i=0, l = state.videoAnnotations.length; i < l; i++) {
                if (payload.annotationId === state.videoAnnotations[i].id) {
                    state.videoAnnotations[i].comment = payload.body.comment
                    state.videoAnnotations[i].from = payload.body.from
                    state.videoAnnotations[i].to = payload.body.to
                    state.videoAnnotations[i].rating = payload.body.rating
                }
            }
        },
        DELETE_ANNOTATION: (state, payload) => {
            for (var i = 0, l = state.videoAnnotations.length; i < l; i++) {
                if (state.videoAnnotations[i].id === payload) {
                    state.videoAnnotations.splice(i, 1)
                }
            } 
        },
        SORT_ANNOTATIONS: (state) => {
            var annotations = state.videos.annotations
            annotations.sort(function(a,b) {return (a.from > b.from) ? 1 : ((b.from > a.from) ? -1 : 0);} );
        },
        /* CLASSES */ 
        GET_ALL_CLASSES: (state, theClasses) => {
            loadingInstance.close()
            state.classes = theClasses
        },
        GET_CLASS: (state, theClass) => {
            loadingInstance.close()
            state.classes = theClass
        },
        CREATE_CLASS: (state, payload) => {
            state.classes.push(payload)
        },
        // Only for admin.
        DELETE_CLASS: (state, payload) => {
            for (var i = 0, l = state.classes.length; i < l; i++) {
                if (state.classes[i].id === payload) {
                    state.classes.splice(i, 1)              
                }
            }
        },
        // ADMIN
        FILL_DEPARTMENTS: (state) => {
            for (var i = 0, l = state.classes.length; i < l; i++) {
                if (!state.departments.includes(state.classes[i].department))
                    state.departments.push(state.classes[i].department)
            }
        },
        SET_UPLOAD_URL: (state, payload) => {
            state.uploadUrl = payload
        },
        CURRENT_CLASS_SELECT: (state, payload) => {
            state.currentClass = payload
        },
        /* ASSIGNMENTS */
        GET_ASSIGNMENTS: (state, assignments) => {
            state.assignments = assignments
        },
        CREATE_ASSIGNMENT: (state, newAssignment) => {
            state.assignments.push(newAssignment)
        },
        DELETE_ASSIGNMENT: (state, assignmentIdToBeDeleted) => {
            for (var i = 0, l = state.assignments.length; i < l; i++) {
                if (state.assignments[i].id === assignmentIdToBeDeleted) 
                    state.assignments.splice(i,1)
            }
        },
        /* GENRES */
        GET_GENRES: (state, genres) => {
            state.genres = genres
        },
        /* CANONS */
        GET_CANONS: (state, canons) => {
            // Setting the canons in the right order.
            // Unfortunately, the backend gives us false order.
            // :(
            state.canons['Invention'] = canons['Invention']
            state.canons['Structure'] = canons['Structure']
            state.canons['Delivery'] = canons['Delivery']
            state.canons['Visuals'] = canons['Visuals']
            state.canons['Style'] = canons['Style']
        },
        /* CATEGORIES */
        GET_CATEGORIES: (state, categories) => {
            state.categories = categories
        },
        /* COLLABORATORS */
        GET_ALL_COLLABORATIONS: (state, allCollaborations) => {
            state.allCollaborations = allCollaborations
        },
        GET_COLLABORATIONS_BY_VIDEO_ID: (state, videoCollaborations) => {
            state.videoCollaborations = videoCollaborations
        },
        GET_COLLABORATORS_BY_VIDEO_ID: (state, videoCollaborators) => {
            state.videoCollaborators = videoCollaborators
        },
        GET_COLLABORATIONS_BY_USER_ID: (state, userCollaborations) => {
            state.userCollaborations = userCollaborations
        },
        GET_COLLABORATED_VIDEOS_BY_USER_ID: (state, userCollaborated) => {
            state.userCollaborated = userCollaborated
        },
        /* USERS */
        GET_USERS: (state, users) => {
            state.users = users
        },
        /* ENROLLMENTS */
        GET_ENROLLMENTS: (state, enrollments) => {
            state.enrollments = enrollments
        },
        GET_USER_ENROLLMENTS: (state, userEnrollments) => {
            state.userEnrollments = userEnrollments
        },
        /* ENROLLMENTS */
        GET_ENROLLED_STUDENTS_BY_CLASSID: (state, enrolledStudentsByClassId) => {
            // var enrolledUsersInThisClass = payload.data // All users that have enrolled, including the not yet accepted enrollments
            // var activeEnrolledUsers = [] // The users that have been accepted in this class
            // var inactiveEnrolledUsers = [] // The users that have requested enrollement but have not been accepted in this class
            // // console.log(enrolledUsersInThisClass)
            // for (var i = 0; i < enrolledUsersInThisClass.length; i++) {
            //     for(var j = 0; j < state.enrollments.length; j++){
            //         // UserId must be found in enrollments and the classId of that enrollment must be the current class
            //         if (state.enrollments[j].userId === enrolledUsersInThisClass[i].id && state.enrollments[j].classId === payload.classId){
            //             // The enrollment should be in accepted status or else the user is not considered "enrolled"/active
            //             if (state.enrollments[j].accepted){
            //                 activeEnrolledUsers.push(enrolledUsersInThisClass[i])
            //             }
            //             else {
            //                 inactiveEnrolledUsers.push(enrolledUsersInThisClass[i])
            //             }
            //         }
            //     }
            // }
            // console.log(activeEnrolledUsers)
            // console.log(enrolledUsersInThisClass)
            // state.enrolledUsersInThisClass = enrolledUsersInThisClass
            state.classEnrolledStudents = enrolledStudentsByClassId
        },
        GET_ENROLLMENTS_BY_CLASS_ID: (state, enrollmentsByClassId) => {
            state.classEnrollments = enrollmentsByClassId
        },
        GET_ENROLLED_CLASSES: (state, enrolledClasses) => {
            state.enrolledClasses = enrolledClasses
        },
        CREATE_ENROLLMENT: (state, newEnrollment) => {
            state.enrollments.push(newEnrollment)
        },
        EDIT_ENROLLMENT: (state, editedEnrollment) => {
            for (var e = 0; e < state.enrollments.length; e++) {
                if (state.enrollments[e].id === editedEnrollment.id)
                    state.enrollments[e] = editedEnrollment
                    break
            }
        },
        DELETE_ENROLLMENT: (state, deletedEnrollmentId) => {
            for (var i = 0, l = state.enrollments.length; i < l; i++) {
                if (state.enrollments[i].id === deletedEnrollmentId) 
                    state.enrollments.splice(i,1)
                    break
            }
        }
    },

    getters: {
        videos: state => {
            return state.videos
        },
        videoAnnotations: state => {
            return state.videoAnnotations
        },
        classes: state => {
            return state.classes
        },
        assignments: state => {
            return state.assignments
        },
        genres: state => {
            return state.genres
        },
        categories: state => {
            return state.categories
        },
        users: state => {
            return state.users
        },
        // Collaborators
        allCollaborations: state => {
            return state.allCollaborations   // All collaborations of MT
        },
        videoCollaborations: state => {
            return state.videoCollaborations // Collaborations of current video
        },
        videoCollaborators: state => {
            return state.videoCollaborators  // Collaborators of current video
        },
        userCollaborations: state => {
            return state.userCollaborations  // Collaborations of current user
        },
        userCollaborated: state => {
            return state.userCollaborated    // Collaborated videos of current user
        },
        // Enrollments
        enrollments: state => {
            return state.enrollments           // All enrollments from enrollment resource
        },
        enrollmentsByClassId: state => {
            return state.enrollmentsByClassId  // All enrollments of provided classId from enrollment resource
        },
        classEnrolledStudents: state => {
            return state.classEnrolledStudents // All students enrolled in provided classId from enrolledUser resource
        },
        classEnrollments: state => {
            return state.classEnrollments      // All enrollments of provided classId from enrollment resource
        },
        userEnrollments: state => {
            return state.userEnrollments       // All enrollments of provided userId from enrollment resource
        },
        enrolledClasses: state => {
            return state.enrolledClasses       // All enrolled class of provided userId from enrolledClass resource
        },
        // End enrollments
        currentVideoID: state => {
            return state.currentVideoID
        },
        canons: state => {
            return state.canons
        },
        departments: state => {
            return state.departments
        },
        currentClass: state => {
            return state.currentClass
        },
        uploadVideoProps: state => {
            return state.uploadVideoProps
        },
        uploadUrl: state => {
            return state.uploadUrl
        },
        uploadingVideo: state => {
            return state.uploadingVideo
        }
    }
})