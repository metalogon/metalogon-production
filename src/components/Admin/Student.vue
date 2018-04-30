<template>

		<div class="student">

			<my-header></my-header>
			
			<div class="student__body columns">

				<div class="student__main column is-10">

					<div class="featured">
						<h3 class="featured__heading">Featured videos of {{ currentClassSelected }}</h3>
						<div class="featured__container">
							<mt-video-card v-for="v in videos" v-bind:key="v.id" :currentVideo="v" v-if="(currentClassSelected !== 'Home' && v.class === currentClassSelected && v.featuredClass === true) || (currentClassSelected === 'Home' && v.featuredGlobal === true)">
							</mt-video-card>
						</div>
					</div>

					<div class="student__classvideos" v-show="!(currentClassSelected === 'Home')">
							<h3 class="class__heading"> {{ currentClassNumber }} - {{ currentClassSelected }}</h3>
							<mt-video-itemlist v-for="v in videos" v-bind:key="v.id" :currentVideo="v" v-if="v.class === currentClassSelected"></mt-video-itemlist>
					</div>

					<upload-video :currentClassProp="currentClassSelected"></upload-video>

				</div>

				<mt-sidebar></mt-sidebar>

			</div>
			
			<my-footer></my-footer>	
 
		
		</div>	

</template>

<script>
	import _ from 'lodash'
	import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
	import UploadVideo from '../Extra/UploadVideo.vue'
	import MyHeader from '../Layout/MyHeader.vue'
	import MyFooter from '../Layout/MyFooter.vue'
	import MtVideoCard from './Shared/MtVideoCard.vue'
	import MtVideoItemList from './Shared/MtVideoItemList.vue'
	import MtSidebar from './Shared/MtSidebar.vue'

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
				this.$store.state.currentClassSelected = 'Home'
			},
			mounted() {
				// Check if role is student. If not redirect to current role's homePage
				const role = this.$root.$options.authService.getAuthData().role
				// console.log("student.vue, role: " + role)
				if (role.toLowerCase() != "student") {
					// console.log("student.vue, pushing router /decideHome")
					this.$router.push('/DecideHome')
				}

				if (this.$router.currentRoute.fullPath === '/student')
					$('.navbar-end .badge').hide()

				document.body.style.backgroundImage = "none"
				document.body.style.backgroundColor = "#FFF"
			},
			computed: {
				...mapGetters(
					['videos', 'classes', 'studentClasses', 'currentClassSelected', 'currentClassNumber']
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

.student__body { 
	margin-bottom: 0 !important;
	min-height: calc(100vh - 160px);
}

.student__main {
	padding-left: 30px;
	margin-top: 25px;
}

/* ==============================================
                #FEATURED
	================================================= */

	.student__featured {

	}

		.student__featured-container {
			display:flex;
			flex-wrap: wrap;
		}
			
		.featured__heading {
			background-color: #16324f;
			color: #FFF;
			padding: 9px;
			margin-bottom: 0.5em !important;
			border-radius: 7px;
		}





/* ==============================================
                #FTDCARD (Featured card)
	================================================= */

	.ftdcard {
		width: 32.30%;
		margin: 0.3em;
		transition: 0.3s;
		color: #000;
		border: 1px solid #ddd;
	}

	.ftdcard:hover {
		transform: scale(1.02);
		transition: 0.3s;
	}

	.ftdcard__image {

	}

	.ftdcard__meta1 {
		display: flex;
		flex-direction: column;
		padding: 0px 10px;
	}

		.ftdcard__title {
			font-size: 14px;
			line-height: 1.5;
		}

		.ftdcard__class {
			color: #4a4a4a;
			font-size: 12px;
			margin-top: -5px;
		}

	.ftdcard__meta2 {
		display: flex;
		flex-direction: column;
		padding: 0px 10px;
		margin-top: 12px;
	}

		.ftdcard__genre {
			color: #4a4a4a;
			font-size: 12px;
		}

		.ftdcard__date {
			color: #4a4a4a;
			font-size: 12px;
			margin-top: -5px;
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
							font-weight: 600;
							font-size: 18px;
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
                #TRUMPS-BULMA-THEME
	================================================= */
.nav.is-dark {
  background-color: #232B2D;
  color: #F6F7F7;
}
.nav.is-dark .nav-item a, .nav.is-dark a.nav-item {
    color: #F6F7F7;
}
.nav.is-dark .nav-item a.button.is-default {
    color: #F6F7F7;
    background-color: transparent;
    border-width: 2px;
}
.nav.menu {
  border-bottom: 1px solid #e1e1e1;
}
.nav.menu .nav-item .icon-btn {
  border: 3px solid #B7C6C9;
  border-radius: 90px;
  padding: 5px 7px;
  color: #B7C6C9;
}
.nav.menu .nav-item.is-active .icon-btn {
  color: #2EB398;
  border: 3px solid #2EB398;
}
.nav.menu .nav-item .icon-btn .fa {
  font-size: 20px;
  color: #B7C6C9;
}
.nav.menu .nav-item.is-active .icon-btn .fa {
  color: #2EB398;
}
.aside {
  display:block;
  background-color: #F9F9F9;
  border-right: 1px solid #DEDEDE;
}
.messages {
  display:block;
  background-color: #fff;
  border-right: 1px solid #DEDEDE;
}
.message {
  display:block;
  background-color: #fff;
}
.aside .compose {
  height: 95px;
  margin:0 -10px;
  padding: 25px 30px;
}
.aside .compose .button {
  color: #F6F7F7;
}
.aside .compose .button .compose {
  font-size: 14px;
  font-weight: 700;
}
.aside .main {
  padding: 40px;
  color: #6F7B7E;
}
.aside .title {
  color: #6F7B7E;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
.aside .main .item {
  display: block;
  padding: 10px 0;
  color: #6F7B7E;
}
.aside .main .item.active {
  background-color: #F1F1F1;
  margin: 0 -50px;
  padding-left: 50px;
}
.aside .main .item:active,.aside .main .item:hover {
  background-color: #F2F2F2;
  margin: 0 -50px;
  padding-left: 50px;
}
.aside .main .icon {
  font-size: 19px;
  padding-right: 30px;
  color: #A0A0A0;
}
.aside .main .name {
  font-size: 15px;
  color: #5D5D5D;
  font-weight: 500;
}
.messages {
  padding: 40px 20px;
}
.message {
  padding: 40px 20px;
}
.messages .action-buttons {
  padding: 0;
  margin-top: -20px;
}
.message .action-buttons {
  padding: 0;
  margin-top: -5px;
}
.action-buttons .control.is-grouped {
  display: inline-block;
  margin-right: 30px;
}
.action-buttons .control.is-grouped:last-child {
  margin-right: 0;
}
.action-buttons .control.is-grouped .button:first-child {
  border-radius: 5px 0 0 5px;
}
.action-buttons .control.is-grouped .button:last-child {
  border-radius: 0 5px 5px 0;
}
.action-buttons .control.is-grouped .button {
  margin-right: -5px;
  border-radius: 0;
}
.pg {
  display: inline-block;
  top:10px;
}
.action-buttons .pg .title {
  display: block;
  margin-top: 0;
  padding-top: 0;
  margin-bottom: 3px;
  font-size:12px;
  color: #AAAAAA;
}
.action-buttons .pg a{
  font-size:12px;
  color: #AAAAAA;
  text-decoration: none;
}
.is-grouped .button {
  background-image: linear-gradient(#F8F8F8, #F1F1F1);
}
.is-grouped .button .fa {
  font-size: 15px;
  color: #AAAAAA;
}
.inbox-messages {
  margin-top:60px;
}
.message-preview {
  margin-top: 60px;
}
.inbox-messages .card {
  width: 100%;
}
.inbox-messages strong {
  color: #5D5D5D;
}
.inbox-messages .msg-check {
  padding: 0 20px;
}
.inbox-messages .msg-subject {
  padding: 10px 0;
  color: #5D5D5D;
}
.inbox-messages .msg-attachment {
  float:right;
}
.inbox-messages .msg-snippet {
  padding: 5px 20px 0px 5px;
}
.inbox-messages .msg-subject .fa {
  font-size: 14px;
  padding:3px 0;
}
.inbox-messages .msg-timestamp {
  float: right;
  padding: 0 20px;
  color: #5D5D5D;
}
.message-preview .avatar {
  display: inline-block;
}
.message-preview .top .address {
  display: inline-block;
  padding: 0 20px;
}
.avatar img {
  width: 40px;
  border-radius: 50px;
  border: 2px solid #999;
  padding: 2px;
}
.address .name {
  font-size: 16px;
  font-weight: bold;
}
.address .email {
  font-weight: bold;
  color: #B6C7D1;
}
.card.active {
  background-color:#F5F5F5;
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
	.is-bg-mt-yellow {
	  background-color: #B6AC1C;
	}
        .menu-list .is-bg-mt-yellow:hover {
            background-color: #ada316;
        }

</style>