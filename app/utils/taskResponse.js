import {attachmentsResponse} from "./attachmentResponse.js";

export const taskResponse = (task) => {

   const taskObject = task.toObject()

   return {...taskObject, attachments: attachmentsResponse(task.attachments)}
}