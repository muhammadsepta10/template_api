import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { validateRequestQuery } from '../../config/baseFunction';
import moment from "moment";


const generate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        totalEntries()
        totalProfiles()
        totalDemographic()
        res.send({ message: "ok", data: {} })
    } catch (error) {
        next(error)
    }
}

const totalEntries = async () => {
    const medias = (await model.getMediaActive()).map((value: any) => {
        return value.code
    })
    const summaryEntriesDaily = await model.entriesSummary({
        condition: 1,
        type: 0,
        subtract: 0,
        date: moment().subtract(1, "day").format("YYYY-MM-DD"),
        media: medias
    })
    const summaryEntriesMonthly = await model.entriesSummary({
        condition: 3,
        type: 0,
        subtract: 0,
        date: moment().subtract(1, "day").format("YYYY-MM-DD"),
        media: medias,
    })
    const summaryEntriesWeekly = await model.entriesSummary({
        condition: 2,
        type: 0,
        subtract: 0,
        date: moment().subtract(1, "day").format("YYYY-MM-DD"),
        media: medias,
    })
    const summaryEntriesHourly = await model.entriesSummary({
        condition: 4,
        type: 0,
        subtract: 0,
        date: moment().subtract(1, "day").format("YYYY-MM-DD"),
        media: medias,
    })
    for (let index = 0; index < summaryEntriesDaily.length; index++) {
        for (let index2 = 0; index2 < medias.length; index2++) {
            const media = medias[index2]
            const counts = parseInt(summaryEntriesDaily[index][`all_${media}`]) ? parseInt(summaryEntriesDaily[index][`all_${media}`]) : 0
            if (counts) {
                await model.updateSummarytotal("entries", "entries", media, counts)
            }
        }
        await model.insertEntriesSummarydayli({
            validMicrosite: summaryEntriesDaily[index].valid_400,
            invalidMicrosite: summaryEntriesDaily[index].invalid_400,
            validWa1: summaryEntriesDaily[index].valid_301,
            invalidWa1: summaryEntriesDaily[index].invalid_301,
            validWa2: summaryEntriesDaily[index].valid_300,
            invalidWa2: summaryEntriesDaily[index].invalid_300,
            validWa3: summaryEntriesDaily[index].valid_302,
            invalidWa3: summaryEntriesDaily[index].invalid_302,
            valid: summaryEntriesDaily[index].valid,
            invalid: summaryEntriesDaily[index].invalid,
            total: summaryEntriesDaily[index].all,
            label: summaryEntriesDaily[index].DATE,
            table: 'daily'
        })
    }
    for (let index = 0; index < summaryEntriesMonthly.length; index++) {
        await model.insertEntriesSummarydayli({
            validMicrosite: summaryEntriesMonthly[index].valid_400,
            invalidMicrosite: summaryEntriesMonthly[index].invalid_400,
            validWa1: summaryEntriesMonthly[index].valid_301,
            invalidWa1: summaryEntriesMonthly[index].invalid_301,
            validWa2: summaryEntriesMonthly[index].valid_300,
            invalidWa2: summaryEntriesMonthly[index].invalid_300,
            validWa3: summaryEntriesMonthly[index].valid_302,
            invalidWa3: summaryEntriesMonthly[index].invalid_302,
            valid: summaryEntriesMonthly[index].valid,
            invalid: summaryEntriesMonthly[index].invalid,
            total: summaryEntriesMonthly[index].all,
            label: summaryEntriesMonthly[index].DATE,
            table: 'monthly'
        })
    }
    for (let index = 0; index < summaryEntriesWeekly.length; index++) {
        await model.insertEntriesSummarydayli({
            validMicrosite: summaryEntriesWeekly[index].valid_400,
            invalidMicrosite: summaryEntriesWeekly[index].invalid_400,
            validWa1: summaryEntriesWeekly[index].valid_301,
            invalidWa1: summaryEntriesWeekly[index].invalid_301,
            validWa2: summaryEntriesWeekly[index].valid_300,
            invalidWa2: summaryEntriesWeekly[index].invalid_300,
            validWa3: summaryEntriesWeekly[index].valid_302,
            invalidWa3: summaryEntriesWeekly[index].invalid_302,
            valid: summaryEntriesWeekly[index].valid,
            invalid: summaryEntriesWeekly[index].invalid,
            total: summaryEntriesWeekly[index].all,
            label: summaryEntriesWeekly[index].DATE,
            table: 'weekly'
        })
    }
    for (let index = 0; index < summaryEntriesHourly.length; index++) {
        await model.insertEntriesSummarydayli({
            validMicrosite: summaryEntriesHourly[index].valid_400,
            invalidMicrosite: summaryEntriesHourly[index].invalid_400,
            validWa1: summaryEntriesHourly[index].valid_301,
            invalidWa1: summaryEntriesHourly[index].invalid_301,
            validWa2: summaryEntriesHourly[index].valid_300,
            invalidWa2: summaryEntriesHourly[index].invalid_300,
            validWa3: summaryEntriesHourly[index].valid_302,
            invalidWa3: summaryEntriesHourly[index].invalid_302,
            valid: summaryEntriesHourly[index].valid,
            invalid: summaryEntriesHourly[index].invalid,
            total: summaryEntriesHourly[index].all,
            label: summaryEntriesHourly[index].DATE,
            table: 'hourly'
        })
    }
    return true
}

const totalProfiles = async () => {
    const medias = (await model.getMediaActive()).map((value: any) => {
        return value.code
    })
    const summaryProfileDaily = await model.profileSummary({
        condition: 1,
        type: 0,
        subtract: 0,
        date: moment().subtract(1, "day").format("YYYY-MM-DD"),
        media: medias
    })
    const summaryProfileMonthly = await model.profileSummary({
        condition: 3,
        type: 0,
        subtract: 0,
        date: moment().subtract(1, "day").format("YYYY-MM-DD"),
        media: medias,
    })
    const summaryProfileWeekly = await model.profileSummary({
        condition: 2,
        type: 0,
        subtract: 0,
        date: moment().subtract(1, "day").format("YYYY-MM-DD"),
        media: medias,
    })
    const summaryProfileHourly = await model.profileSummary({
        condition: 4,
        type: 0,
        subtract: 0,
        date: moment().subtract(1, "day").format("YYYY-MM-DD"),
        media: medias,
    })

    for (let index = 0; index < summaryProfileDaily.length; index++) {
        const counts = summaryProfileDaily[index][`all`]
        if (counts) {
            await model.updateSummarytotal("profile", "profile", "", counts)
        }
        await model.insertProfileSummary("daily", summaryProfileDaily[index].all, summaryProfileDaily[index].DATE)
    }
    for (let index = 0; index < summaryProfileMonthly.length; index++) {
        await model.insertProfileSummary("monthly", summaryProfileMonthly[index].all, summaryProfileMonthly[index].DATE)
    }
    for (let index = 0; index < summaryProfileWeekly.length; index++) {
        await model.insertProfileSummary("weekly", summaryProfileWeekly[index].all, summaryProfileWeekly[index].DATE)
    }
    for (let index = 0; index < summaryProfileHourly.length; index++) {
        await model.insertProfileSummary("hourly", summaryProfileHourly[index].all, summaryProfileHourly[index].DATE)
    }
    return true
}

const totalDemographic = async () => {
    const data = await model.demographic()
    for (let index = 0; index < data.length; index++) {
        const media = data[index].media
        const male = data[index].male
        const female = data[index].female
        const nonKTPGender = data[index].nonKTPGender
        const umur17 = data[index].umur17
        const umur17_25 = data[index].umur17_25
        const umur26_35 = data[index].umur26_35
        const umur36_45 = data[index].umur36_45
        const umur46_55 = data[index].umur46_55
        const umur55 = data[index].umur55
        const nonKTPAge = data[index].nonKTPAge
        await model.updateSummarytotal("male", "gender", media, male)
        await model.updateSummarytotal("female", "gender", media, female)
        await model.updateSummarytotal("non ktp", "gender", media, nonKTPGender)
        await model.updateSummarytotal("< 17 thn", "age", media, umur17)
        await model.updateSummarytotal("17 - 25 thn", "age", media, umur17_25)
        await model.updateSummarytotal("26 - 35 thn", "age", media, umur26_35)
        await model.updateSummarytotal("36 - 45 thn", "age", media, umur36_45)
        await model.updateSummarytotal("46 - 55 thn", "age", media, umur46_55)
        await model.updateSummarytotal("> 55 thn", "age", media, umur55)
        await model.updateSummarytotal("non ktp", "age", media, nonKTPAge)
    }
    return true
}

export default generate