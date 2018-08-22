<template>
    <div class="wiki__subhead">

        <div class="wiki__subheadMenu">
            <!-- <a class="wiki__subheadLink">HOW IT WORKS</a>
            <a class="wiki__subheadLink">BROWSE TERMS</a>
            <a class="wiki__subheadLink">FORUM <i class="fa fa-caret-down"></i></a> -->
            <button class="wiki__subheadLink wiki__subheadButton" @click="modalPostATermIsOpen = true">Post a Term</button>
        </div>

        <el-dialog title="Post a term" :visible.sync="modalPostATermIsOpen">
            <el-form :model="term">
                    <el-form-item label="Name">
                        <el-input v-model="term.name" placeholder="Type a name"></el-input>
                    </el-form-item>
                    <el-form-item label="Canon">
                        <br/>
                        <el-select v-model="term.canon" placeholder="Choose a canon">
                            <el-option v-for="c in canons" :key="c.name" :label="c.name" :value="c.name" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Definition">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="Description">
                        <el-input v-model="term.description" type="textarea"></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="modalPostATermIsOpen = false">Cancel</el-button>
                    <el-button class="add-class-btn" @click="postCategory()">Post a term</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
    export default {
        data() {
            return {
                modalPostATermIsOpen: false,
                term: {
                    name: '',
                    canon: '',
                    description: ''
                }
            }
        },
        methods: {
            postCategory() {
                if (this.term.name !== '' && this.term.canon !== '' && this.term.description !== '')
                    this.$store.dispatch('postCategory', this.term)

                this.modalPostATermIsOpen = false
            }
        },
        computed: {
			...mapGetters(
				[ 'categories', 'canons' ]
			)
		},
    }
</script>

<style>

.wiki__body {
    
}

    .wiki__contentdiv {
        display: flex;
        flex-direction: column;
    }

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

</style>