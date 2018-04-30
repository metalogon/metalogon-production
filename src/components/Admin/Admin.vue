<template>
		
		<div class="admin">
			
			<my-header></my-header>
			
			<div class="admin__body columns">

				<div class="admin__main column is-10">

						<div class="featured">
								<h3 class="featured__heading">Featured videos of Home</h3>
								<div class="featured__container">
									<mt-video-card v-for="video in videos" v-bind:key="video.id" :currentVideo="video" v-if="video.featuredGlobal === true"></mt-video-card>
								</div>
						</div>

					<div class="admin__classvideos" v-show="!(currentClass.name === 'Home')">
							<h3 class="class__heading"> {{ currentClass.number }} - {{ currentClass.name }}</h3>
							<mt-video-itemlist v-for="v in videos" v-bind:key="v.id" :currentVideo="v" v-if="v.class === currentClass.name"></mt-video-itemlist>
					</div>
					
					<upload-video :currentClassProp="currentClass.name"></upload-video>

				</div>

				<mt-sidebar></mt-sidebar>

			</div>
			
			<my-footer></my-footer>			
			
		</div>	

</template>



<script>
	import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
	import UploadVideo from '../Extra/UploadVideo.vue'
	import MyHeader from '../Layout/MyHeader.vue'
	import MtSidebar from './Shared/MtSidebar.vue'
	import MyFooter from '../Layout/MyFooter.vue'
	import MtVideoCard from './Shared/MtVideoCard.vue'
	import MtVideoItemList from './Shared/MtVideoItemList.vue'

    export default {
			data() {
				return {
				}
			},
			methods: {
				
			},
			created() {
				this.$store.dispatch('getAllVideos')
				this.$store.dispatch('getAllClasses')
				this.$store.state.currentClass.name = 'Home'
			},
			mounted() {
				// Check if role is admin. If not redirect to current role's homePage
				const role = this.$root.$options.authService.getAuthData().role
				// console.log("admin.vue, role: " + role)
				if (role.toLowerCase() != "admin") {
					// console.log("admin.vue, pushing router /decideHome")
					this.$router.push('/DecideHome')
				}
				document.body.style.backgroundImage = "none"
				document.body.style.backgroundColor = "#FFF"
			},
			computed: {
				...mapGetters(
					['videos', 'classes', 'currentClass', 'adminClasses']
				),
			},
			components: {
				'upload-video': UploadVideo,
				'my-header': MyHeader,
				'my-footer': MyFooter,
				'mt-video-card': MtVideoCard,
				'mt-video-itemlist': MtVideoItemList,
				'mt-sidebar': MtSidebar
			}
		}
</script>

<style>
.admin__body { 
	margin-bottom: 0 !important;
	min-height: calc(100vh - 160px);
}

.admin__main {
	padding-left: 30px;
	margin-top: 25px;
}





/* ==============================================
                #CLASS-VIDEOS
	================================================= */

		.professor__classvideos {
			margin-top: 10px;
		}

		.class__heading {
			background-color: #16324f;
			color: #FFF;
			padding: 9px;
			margin-bottom: 0.5em !important;
			border-radius: 7px;
		}

		.classvideo {
			display: flex;
			padding: 17px 10px;
			border-bottom: 1px solid #efefef;
		} 
		.classvideo:hover	{
			background-color: #F5F5F5;
		}

			.classvideo__favorite {
				width: 30px;
				height: 60px;
			}

			.classvideo__metadata {
				display: flex;
				justify-content: space-between;
				margin-left: 20px;
				width: 100%;
			}

				.classvideo__image {
					display: flex;
					width: 200px;
					height: 60px;
				}

				.classvideo__titles {
					width: 100%;
					margin-left: 15px;
				}
						.classvideo__title {
							color: #4a4a4a;
							font-size: 18px;
							font-weight: 600;
						}
						.classvideo__class {
							margin-top: 6px;
							font-size: 14px;
						}
						.classvideo__genre {
							margin-top: -4px;
							font-size: 14px;
						}

				.classvideo__metameta {
					display: flex;
					margin-left: 15px;
				}

					.classvideo__score {
						background-color:#89a9c0; 
						color: #fff;
						padding: 0px 8px;
						display: flex;
						flex-direction: column;
						justify-content: center;
						border-radius: 4px;
						margin-top: 10px;
					}
							.classvideo__scoreNum {
								font-weight: 600;
								font-size: 1.8em;
								height: 50%;
								margin-top: 10px;
							}
							.classvideo__scoreLabel {
								font-size: 0.8em;
								text-align: center;
								height: 50%;
 							}

					.classvideo__annotations {
						margin-top: 10px;
						margin-left: 10px;
						background-color:#89a9c0; 
						color: #fff;
						padding: 0px 8px;
						display: flex;
						flex-direction: column;
						justify-content: center;
						border-radius: 4px;
					}
							.classvideo__annotationsNum {
								font-weight: 600;
								font-size: 1.8em;
								text-align: center;
								height: 50%;
								margin-top: 10px;
							}
							.classvideo__annotationsLabel {
								font-size: 0.8em;
								text-align: center;
								height: 50%;
							}




/* ==============================================
                #ADMIN-SIDEBAR
	================================================= */

	.admin__sidebar {
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

		.admin__sidebar a {
			color: #4a4a4a;
			font-size: 13px;
			margin: 0;
			padding: 12px 12px 12px 12px;
		}
		.admin__sidebar a:hover {
			background-color: #f5f5f5;
		}
			.admin__sidebar a i {
				padding-right: 5px;
			}





/* ==============================================
                #ANNOTATION-BADGE
	================================================= */

    .el-badge {
        position: relative;
        vertical-align: middle;
        display: inline-block;
		top: -120px;
    }

    .el-badge__content {
        background-color: #A90931;
        border-radius: 10px;
        color: #fff;
        display: inline-block;
        font-size: 12px;
        height: 18px;
        line-height: 18px;
        padding: 0 6px;
        text-align: center;
        border: 1px solid #fff;
    }





	/* ==============================================
                #TRUMPS
	================================================= */
	
	.dialog-footer .el-button.upload-video-btn {
		background: #A90931;
		color: #fff;
		border: none;
	}

	.inputfile {
		width: 0.1px;
		height: 0.1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	}
	.inputfile + label {
		font-size: 1.25em;
		font-weight: 700;
		color: white;
		background-color: black;
		display: inline-block;
	}

	.inputfile:focus + label,
	.inputfile + label:hover {
		background-color: red;
	}
	.inputfile + label {
		cursor: pointer; /* "hand" cursor */
	}
	.inputfile:focus + label {
		outline: 1px dotted #000;
		outline: -webkit-focus-ring-color auto 5px;
	}

	.up-label {
		padding: 100px 135px 100px 135px;
    	font-size: 1.7em;
	}




	/* ==============================================
                #HELPERS
	================================================= */

	.is-bg-light {
		background-color: #f1f1f1;
	}

</style>