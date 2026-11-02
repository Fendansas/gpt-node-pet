import Outbox from "../models/outbox.model.js";


class OutboxRepository {


    async create(data, session = null) {


        const options = session ? { session } : {};
        const outbox = await Outbox.create(
            [
                {
                    eventType: data.eventType,
                    payload: data.payload,
                    status: data.status,
                }
            ],
            options
        )
        return outbox
    }

    async getPending(limit = 10) {
        const pending = await Outbox.find({
            status: 'pending'
        })
            .sort({createdAt: 1})
            .limit(limit)
        return pending
    }

    async markProcessed(id) {
        const outbox = await Outbox.findByIdAndUpdate(id, {
            status:'processed',
            processedAt: new Date()
        },
            { new: true }
        )

        return outbox
    }

}


export default new OutboxRepository();