const filterTel = (value: string) => {
	return value.replace(/\D/g, '')
}

export {
	filterTel,
}