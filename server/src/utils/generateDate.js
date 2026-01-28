import moment from 'moment'

const generateDate = () => {
    let today = new Date()
    let expireDay = moment(today).add(10, 'days').toDate()

    return {
        today: moment(today).format('YYYY-MM-DD'),
        expireDay: moment(expireDay).format('YYYY-MM-DD')
    }
}

export default generateDate
