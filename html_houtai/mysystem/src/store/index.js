import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	nickName: '',
	nickNameTwo: '',
	foreman: '',
	designerName: '',
	engineer: '',
	nickNameID: '',
	nickNameTwoID: '',
	foremanID: '',
	designerNameID: '',
	engineerID: '',
	childData: ''
}

const mutations = {
	checkNIckName(state, n){
		return state.nickName = n
	},
	checkNIckNameTwo(state, n){
		return state.nickNameTwo = n
	},
	addforeman(state, n){
		return state.foreman = n 
	},
	addDesigner(state, n){  
		return state.designerName = n
	},
	addEngineer(state, n){
		return state.engineer = n  
	},

	checkNIckNameID(state, n){
		return state.nickNameID = n
	},
	checkNIckNameTwoID(state, n){
		return state.nickNameTwoID = n
	},
	addforemanID(state, n){
		return state.foremanID = n 
	},
	addDesignerID(state, n){  
		return state.designerNameID = n
	},
	addEngineerID(state, n){
		return state.engineerID = n 
	},
	childernList(state, n) {
		return state.childData = n
	}
}

const getters = {
	getChildernList: state => {
		return state.childData
	},
	getNIckName: state => {
		return state.nickName
	},
	getNIckNameTwo: state => {
		return state.nickNameTwo
	}
}

export default new Vuex.Store({
	state,
	mutations, 
	getters
})
