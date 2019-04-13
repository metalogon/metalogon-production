<template>

    <div style="display: inline-block">
        <button class="collaborators button" @click="openModalCanonChart()">
            <i class="fa fa-bar-chart"></i><span>Canon statistics</span>
        </button>

        <el-dialog :title="currentVideo.title" :visible.sync="modalCanonChartIsOpen">
                <div class="uploadvid__sync-load" 
                    v-loading="loadingModalCanonChart" 
                    v-show="loadingModalCanonChart"
                    element-loading-text="Loading..." 
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
            <ve-histogram v-if="!loadingModalCanonChart && canonInfo.length !== 0" :data="chartData" :extend="chartExtend" :settings="chartSettings"></ve-histogram>
            <el-table v-if="!loadingModalCanonChart" :data="canonInfo" style="width: 100%">
                <el-table-column prop="canon" label="Canon" >
                </el-table-column>
                <el-table-column prop="annotationCount" label="Total # of annotations">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>

</template>

<script>
    import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
    
    export default {
        props: ['currentVideo', 'currentAnnotations'], 
        data() {
            return {
                modalCanonChartIsOpen: false,
				loadingModalCanonChart: false,
				chartData: {
					columns: ['canon', 'averageRating'],
					rows: []
                },
                chartSettings: { 
					yAxisType: 'value',
					min: [0],
					max: [5]
				},
				chartExtend: { series: {} },
				canonInfo: [], // Helper array for v-chart array: chartData.rows[] 
            }
        },
        methods: {
            openModalCanonChart() {
				this.modalCanonChartIsOpen = true
				this.loadingModalCanonChart = true
                this.loadingModalCanonChart = false
                this.canonAverageRating(this.currentAnnotations)						

			},
			canonAverageRating(annotations) {
				this.canonInfo = []
				this.chartData.rows = []
				var found = false

				// Fills the canonInfo helper array with objects.
				for (var i = 0; i < annotations.length; i++) {
					for (var j = 0; j < this.canonInfo.length; j++) {
						if (annotations[i].canon === this.canonInfo[j].canon) {
							found = true
							if (annotations[i].rating != 0) {
								this.canonInfo[j].sumRating = this.canonInfo[j].sumRating + annotations[i].rating
								this.canonInfo[j].annotationCount++
							}
						} 
					}
					if (found === false) {
						if (annotations[i].rating != 0) {
							this.canonInfo.push({ canon: annotations[i].canon, sumRating: annotations[i].rating, annotationCount: 1 })
						}
					}
					found = false
				}
				
				// Orders the chartData.rows array by canon name.
				const CANON_ORDER = ['Invention', 'Structure', 'Delivery', 'Visuals', 'Style']
				for (var i = 0; i < CANON_ORDER.length; i++) {
					for (var j = 0; j < this.canonInfo.length; j++) {
						if (this.canonInfo[j].canon === CANON_ORDER[i]) {
							 // We move an object by its canon name. The arrangement is determined by the CANON_ORDER array.
							this.moveArrayItemByIndex(this.canonInfo, j, i)
						}
					}
				}

				for (var i = 0; i < this.canonInfo.length; i++) {
					this.chartData.rows.push({ canon: this.canonInfo[i].canon, averageRating: this.canonInfo[i].sumRating / this.canonInfo[i].annotationCount })
				}

				// Fills the bars with the desired colors.
				const CANONS_COLOR_LIST = []
				for (var i = 0; i < this.canonInfo.length; i++) {
					if (this.canonInfo[i].canon === 'Invention') CANONS_COLOR_LIST.push('#15314F')
					else if (this.canonInfo[i].canon === 'Structure') CANONS_COLOR_LIST.push('#F2992E')
					else if (this.canonInfo[i].canon === 'Delivery') CANONS_COLOR_LIST.push('#39A0ED')
					else if (this.canonInfo[i].canon === 'Visuals') CANONS_COLOR_LIST.push('#717C89')
					else if (this.canonInfo[i].canon === 'Style') CANONS_COLOR_LIST.push('#38C97C')
				}
				this.chartExtend = { // The chartExtend object is passed as a parameter to the ve-histogram element.
					series (item) {
						item[0].data = item[0].data.map((v, index) => ({
							value: v,
							itemStyle: { color: CANONS_COLOR_LIST[index] },
						}))
						return item
					}
				}

            },
			moveArrayItemByIndex(array, from, to) {
				// Helper function for canonAverageRating() function.
				// Moves an array item by index.
				array.splice(to, 0, array.splice(from, 1)[0])
			},
        },
        mounted() {
            // console.log("CanonStatistics component mounted!")        
        },
        computed: {
			...mapGetters(
				[ 'categories' ]
			)
        },
        components: {
            
        }
    }
</script>

<style>



</style>