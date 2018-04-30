<template>
    <div class="annomenu">
        <div class="annomenu-option">1</div>
        <div class="annomenu-option">2</div>
        <div class="annomenu-option">3</div>
        <div class="annomenu-option">4</div>
        <div class="annomenu-option">5</div>
        <div class="annomenu-option">6</div>
    </div>
</template>

<script>
    export default {
        mounted() {
        //     console.log(this)
        //     $(document).ready(function() {
        //         var annoMenu = `
        //             <div class="annomenu">
        //                 <div class="annomenu-option">1</div>
        //                 <div class="annomenu-option">2</div>
        //                 <div class="annomenu-option">3</div>
        //                 <div class="annomenu-option">4</div>
        //                 <div class="annomenu-option">5</div>
        //             </div>
        //         `;
                
        //         $('.head').append(annoMenu)
        //         $('.jw-nextup-container').append(annoMenu)
                
        //     })
        }
    }
</script>

<style>
.annomenu {
    color: #fff;
    height: 90px;
    border: 1px solid #fff;
    background: rgba(33,33,33,.8);
    display: flex;
}
.annomenu-option {
    border-right: 1px solid #fff;
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
