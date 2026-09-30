import {attachmentsResponse} from "./attachmentResponse.js";

export const taskResponse = (task) => {
   return {...task, attachments: attachmentsResponse(task.attachments)}
}