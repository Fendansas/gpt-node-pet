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
}


export default new OutboxRepository();