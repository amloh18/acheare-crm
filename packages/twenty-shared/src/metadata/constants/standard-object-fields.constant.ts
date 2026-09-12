import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from '@/application/constants/TwentyStandardApplicationUniversalIdentifier';
import { getSystemRelationFieldUniversalIdentifier } from '@/application/deterministic-identifier/get-system-relation-field-universal-identifier.util';
import { STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from '@/metadata/constants/standard-object-universal-identifiers.constant';
import { buildStandardObjectSystemFields } from '@/metadata/utils/internal/build-standard-object-system-fields.util';

// Important notice:
// - Never ever mutate an existing universal identifier
// - Deleting an existing universal identifier should be very rare
// - System field universal identifiers (id, createdAt, updatedAt, deletedAt,
//   createdBy, updatedBy, position, searchVector) are deterministically derived
//   from the standard application universal identifier, the object universal
//   identifier and the field name (buildStandardObjectSystemFields). The name
//   field is a default field, not a system field, and keeps its hardcoded
//   universal identifier.
// - System relation field universal identifiers are deterministically derived
//   from the object + the relation target object
//   (getSystemRelationFieldUniversalIdentifier).
//
// Fields live in their own const so that both STANDARD_OBJECTS' `fields` and
// its INDEX view (buildStandardObjectIndexView) can read the same field
// universal identifiers.
export const STANDARD_OBJECT_FIELDS = {
  timelineActivity: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
    ),
    timelineActivityTypeId: {
      universalIdentifier: '20202020-e5f8-4839-9dcf-781e260624ee',
    },
    timelineActivityTypeSnapshot: {
      universalIdentifier: '20202020-e006-493a-9b07-f2a768a204ca',
    },
    happensAt: {
      universalIdentifier: '20202020-9526-4993-b339-c4318c4d39f0',
    },
    properties: {
      universalIdentifier: '20202020-f142-4b04-b91b-6a2b4af3bf11',
    },
    workspaceMember: {
      universalIdentifier: '20202020-af23-4479-9a30-868edc474b36',
    },
    targetPerson: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
      }),
    },
    targetCompany: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
      }),
    },
    targetOpportunity: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
      }),
    },
    targetTask: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task,
      }),
    },
    targetNote: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.note,
      }),
    },
    targetWorkflow: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflow,
      }),
    },
    targetWorkflowVersion: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowVersion,
      }),
    },
    targetWorkflowRun: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowRun,
      }),
    },
    targetDashboard: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.dashboard,
      }),
    },
    targetMessageList: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageList,
      }),
    },
    targetMessageCampaign: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageCampaign,
      }),
    },
    targetRequirement: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
      }),
    },
    targetCandidate: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
      }),
    },
    targetSubmission: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
      }),
    },
    targetInterview: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
      }),
    },
    targetTeam: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
      }),
    },
    targetLocation: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
      }),
    },
    targetEmployee: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
      }),
    },
    targetInvoice: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
      }),
    },
    linkedRecordCachedName: {
      universalIdentifier: '20202020-cfdb-4bef-bbce-a29f41230934',
    },
    linkedRecordId: {
      universalIdentifier: '20202020-2e0e-48c0-b445-ee6c1e61687d',
    },
    linkedObjectMetadataId: {
      universalIdentifier: '20202020-c595-449d-9f89-562758c9ee69',
    },
  },
  attachment: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
    ),
    name: { universalIdentifier: '20202020-87a5-48f8-bbf7-ade388825a57' },
    file: { universalIdentifier: '20202020-15db-460e-8166-c7b5d87ad4be' },
    //deprecated
    fullPath: { universalIdentifier: '20202020-0d19-453d-8e8d-fbcda8ca3747' },
    //deprecated
    fileCategory: {
      universalIdentifier: '20202020-8c3f-4d9e-9a1b-2e5f7a8c9d0e',
    },
    targetTask: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task,
      }),
    },
    targetNote: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.note,
      }),
    },
    targetPerson: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
      }),
    },
    targetCompany: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
      }),
    },
    targetOpportunity: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
      }),
    },
    targetDashboard: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.dashboard,
      }),
    },
    targetWorkflow: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflow,
      }),
    },
    targetRequirement: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
      }),
    },
    targetCandidate: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
      }),
    },
    targetSubmission: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
      }),
    },
    targetInterview: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
      }),
    },
    targetTeam: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
      }),
    },
    targetLocation: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
      }),
    },
    targetEmployee: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
      }),
    },
    targetInvoice: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
      }),
    },
  },
  blocklist: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.blocklist,
    ),
    handle: { universalIdentifier: '20202020-eef3-44ed-aa32-4641d7fd4a3e' },
    scope: { universalIdentifier: '20202020-1a5f-4c9e-9b3e-7d2a6f4c8e11' },
    workspaceMember: {
      universalIdentifier: '20202020-548d-4084-a947-fa20a39f7c06',
    },
  },
  calendarChannelEventAssociation: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarChannelEventAssociation,
    ),
    calendarChannelId: {
      universalIdentifier: '20202020-93ee-4da4-8d58-0282c4a9cb7d',
    },
    calendarEvent: {
      universalIdentifier: '20202020-5aa5-437e-bb86-f42d457783e3',
    },
    eventExternalId: {
      universalIdentifier: '20202020-9ec8-48bb-b279-21d0734a75a1',
    },
    recurringEventExternalId: {
      universalIdentifier: '20202020-c58f-4c69-9bf8-9518fa31aa50',
    },
  },
  calendarEventParticipant: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventParticipant,
    ),
    calendarEvent: {
      universalIdentifier: '20202020-fe3a-401c-b889-af4f4657a861',
    },
    handle: {
      universalIdentifier: '20202020-8692-4580-8210-9e09cbd031a7',
    },
    displayName: {
      universalIdentifier: '20202020-ee1e-4f9f-8ac1-5c0b2f69691e',
    },
    isOrganizer: {
      universalIdentifier: '20202020-66e7-4e00-9e06-d06c92650580',
    },
    responseStatus: {
      universalIdentifier: '20202020-cec0-4be8-8fba-c366abc23147',
    },
    person: {
      universalIdentifier: '20202020-5761-4842-8186-e1898ef93966',
    },
    workspaceMember: {
      universalIdentifier: '20202020-20e4-4591-93ed-aeb17a4dcbd2',
    },
  },
  calendarEvent: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEvent,
    ),
    title: { universalIdentifier: '20202020-080e-49d1-b21d-9702a7e2525c' },
    isCanceled: {
      universalIdentifier: '20202020-335b-4e04-b470-43b84b64863c',
    },
    isFullDay: {
      universalIdentifier: '20202020-551c-402c-bb6d-dfe9efe86bcb',
    },
    startsAt: {
      universalIdentifier: '20202020-2c57-4c75-93c5-2ac950a6ed67',
    },
    endsAt: { universalIdentifier: '20202020-2554-4ee1-a617-17907f6bab21' },
    externalCreatedAt: {
      universalIdentifier: '20202020-9f03-4058-a898-346c62181599',
    },
    externalUpdatedAt: {
      universalIdentifier: '20202020-b355-4c18-8825-ef42c8a5a755',
    },
    description: {
      universalIdentifier: '20202020-52c4-4266-a98f-e90af0b4d271',
    },
    location: {
      universalIdentifier: '20202020-641a-4ffe-960d-c3c186d95b17',
    },
    iCalUid: {
      universalIdentifier: '20202020-f24b-45f4-b6a3-d2f9fcb98714',
    },
    conferenceSolution: {
      universalIdentifier: '20202020-1c3f-4b5a-b526-5411a82179eb',
    },
    conferenceLink: {
      universalIdentifier: '20202020-35da-43ef-9ca0-e936e9dc237b',
    },
    calendarChannelEventAssociations: {
      universalIdentifier: '20202020-bdf8-4572-a2cc-ecbb6bcc3a02',
    },
    calendarEventParticipants: {
      universalIdentifier: '20202020-e07e-4ccb-88f5-6f3d00458eec',
    },
    calendarEventTargets: {
      universalIdentifier: '2b4a0785-3462-485f-b1a8-79ebb2078eab',
    },
    callRecordings: {
      universalIdentifier: '48d6d151-18e2-4111-b405-d85fb9d860d8',
    },
  },
  calendarEventTarget: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventTarget,
    ),
    calendarEvent: {
      universalIdentifier: 'a47824b0-0e64-4c1f-bbad-ce45209d119b',
    },
    isAutomaticallyAssigned: {
      universalIdentifier: 'b6374fed-9cf2-49ef-b45a-1d6814c16264',
    },
    isManuallyAssigned: {
      universalIdentifier: '6afbd5b8-25b5-4c04-82e5-281e6f90f453',
    },
    targetPerson: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
      }),
    },
    targetCompany: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
      }),
    },
    targetOpportunity: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
      }),
    },
  },
  callRecording: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.callRecording,
    ),
    title: {
      universalIdentifier: '4cff8863-a1d1-45fd-a370-4eb6aa1f2a5b',
    },
    status: {
      universalIdentifier: '3e617680-d93e-4309-a54f-90f69528bfd7',
    },
    recordingRequestStatus: {
      universalIdentifier: '7fd681c9-244c-4e98-8939-7b175d472638',
    },
    applicationId: {
      universalIdentifier: '24ec1239-1240-42cb-8a2d-302632378e09',
    },
    externalBotId: {
      universalIdentifier: '0a2da128-9bcc-488b-bc31-65318c41bdf9',
    },
    externalRecordingId: {
      universalIdentifier: '6d17fb71-324b-4625-a5be-b3580607e2c7',
    },
    startedAt: {
      universalIdentifier: '6c56c23f-1987-410a-860a-df3b2b3f9a33',
    },
    endedAt: {
      universalIdentifier: '7a38a9cf-8424-4d6e-b80a-6883d3c662ef',
    },
    video: {
      universalIdentifier: 'bb9523d3-457e-4f4b-8c79-27a77afb87da',
    },
    audio: {
      universalIdentifier: '2eafc2d0-8fec-430c-a939-65ca5fbc0f08',
    },
    transcript: {
      universalIdentifier: '27b86d68-57d1-4607-aca0-191896b1ad43',
    },
    summary: {
      universalIdentifier: 'adb0f472-756b-4d3f-b21e-ea32bf73a5e4',
    },
    calendarEvent: {
      universalIdentifier: '49e64b28-bd98-4775-80ea-4781bdd45e35',
    },
  },
  company: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
    ),
    name: { universalIdentifier: '20202020-4d99-4e2e-a84c-4a27837b1ece' },
    domainName: {
      universalIdentifier: '20202020-0c28-43d8-8ba5-3659924d3489',
    },
    address: { universalIdentifier: '20202020-c5ce-4adc-b7b6-9c0979fc55e7' },
    linkedinLink: {
      universalIdentifier: '20202020-ebeb-4beb-b9ad-6848036fb451',
    },
    annualRevenue: {
      universalIdentifier: '60f533b7-2166-4071-a767-ceb0286822fd',
    },
    people: { universalIdentifier: '20202020-3213-4ddf-9494-6422bcff8d7c' },
    accountOwner: {
      universalIdentifier: '20202020-95b8-4e10-9881-edb5d4765f9d',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    calendarEventTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventTarget,
      }),
    },
    messageThreadTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThreadTarget,
      }),
    },
    opportunities: {
      universalIdentifier: '20202020-add3-4658-8e23-d70dccb6d0ec',
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
    requirements: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
      }),
    },
    interviews: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
      }),
    },
    invoices: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
      }),
    },
  },
  dashboard: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.dashboard,
    ),
    title: { universalIdentifier: '20202020-20ee-4091-95dc-44b57eda3a89' },
    pageLayoutId: {
      universalIdentifier: '20202020-bb53-4648-aa36-1d9d54e6f7f2',
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.dashboard,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.dashboard,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
  },
  messageCampaign: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageCampaign,
    ),
    name: { universalIdentifier: 'dc8bca0e-37c4-4b78-814d-2e91124274e3' },
    subject: { universalIdentifier: '7251544c-b07a-4f0d-9d0a-48514367f230' },
    bodyTemplate: {
      universalIdentifier: 'b3a69d08-31ca-4a8d-8359-5ca462899342',
    },
    fromAddress: {
      universalIdentifier: '91e1a33c-c1ff-411a-b720-9085e13c05db',
    },
    status: { universalIdentifier: 'c7117256-3de6-48e1-87df-c99c32bad610' },
    sentAt: { universalIdentifier: 'e2315b4f-9edf-4df2-96b9-961e76368671' },
    sentCount: {
      universalIdentifier: '2f333d2b-37b8-4ddc-ad0d-c07c6ce066ad',
    },
    deliveredCount: {
      universalIdentifier: 'f4ee1d33-7379-42fe-ad63-e023449baea6',
    },
    failedCount: {
      universalIdentifier: 'd373fcd7-b1ce-4c77-8031-a5785c475028',
    },
    bouncedCount: {
      universalIdentifier: '20d884a9-34dd-4667-8ecb-ceec224258e2',
    },
    complainedCount: {
      universalIdentifier: '82842cfa-f12a-4bab-bbde-b2cf587d0406',
    },
    skippedCount: {
      universalIdentifier: 'a1f4c6d2-5e8b-4a37-9c60-31b7f0d2a984',
    },
    unsubscribeTopicId: {
      universalIdentifier: '0648e7ad-1769-4ff6-a4d5-72da79ef169c',
    },
    list: { universalIdentifier: 'cb24dcdf-f0e8-4c71-8cff-70b714e86530' },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageCampaign,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
    messages: { universalIdentifier: 'e5a177a7-512b-4778-928e-69777a528f7c' },
    recipients: {
      universalIdentifier: '05a3271c-5b91-493c-8f30-2d27b31d019e',
    },
  },
  messageList: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageList,
    ),
    name: { universalIdentifier: '69b9ed8b-7b26-4108-894f-05700ef7e8ee' },
    description: {
      universalIdentifier: '2484463a-12e0-411e-9586-81892bd7721c',
    },
    members: {
      universalIdentifier: '92df3493-91cf-4665-8587-1b08917d299b',
    },
    campaigns: {
      universalIdentifier: 'e098d838-31ab-4812-91a8-f055f45a6832',
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageList,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  messageListMember: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageListMember,
    ),
    person: { universalIdentifier: '34288425-8805-42fb-8b98-ee13d09be3d3' },
    list: {
      universalIdentifier: 'd5402005-e8f9-4fbe-8696-b6723cd85018',
    },
  },
  messageChannelMessageAssociation: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociation,
    ),
    messageChannelId: {
      universalIdentifier: '20202020-b658-408f-bd46-3bd2d15d7e52',
    },
    message: {
      universalIdentifier: '20202020-da5d-4ac5-8743-342ab0a0336b',
    },
    messageExternalId: {
      universalIdentifier: '20202020-37d6-438f-b6fd-6503596c8f34',
    },
    messageThread: {
      universalIdentifier: '20202020-fac8-42a8-94dd-44dbc920ae16',
    },
    messageThreadExternalId: {
      universalIdentifier: '20202020-35fb-421e-afa0-0b8e8f7f9018',
    },
    direction: {
      universalIdentifier: '75c9b0f7-9e76-44d4-a2f9-47051e61eec7',
    },
    messageFolders: {
      universalIdentifier: '9bfc9da7-ae2d-44fd-9563-ede90c5d6222',
    },
  },
  messageChannelMessageAssociationMessageFolder: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociationMessageFolder,
    ),
    messageChannelMessageAssociation: {
      universalIdentifier: '7411cfa3-4fd9-4b90-a636-940015fd7243',
    },
    messageFolderId: {
      universalIdentifier: 'b3369d31-3856-4a7a-b007-ee353918127c',
    },
  },
  messageParticipant: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageParticipant,
    ),
    message: {
      universalIdentifier: '20202020-985b-429a-9db9-9e55f4898a2a',
    },
    role: {
      universalIdentifier: '20202020-65d1-42f4-8729-c9ec1f52aecd',
    },
    handle: {
      universalIdentifier: '20202020-2456-464e-b422-b965a4db4a0b',
    },
    displayName: {
      universalIdentifier: '20202020-36dd-4a4f-ac02-228425be9fac',
    },
    person: {
      universalIdentifier: '20202020-249d-4e0f-82cd-1b9df5cd3da2',
    },
    workspaceMember: {
      universalIdentifier: '20202020-77a7-4845-99ed-1bcbb478be6f',
    },
    messageCampaign: {
      universalIdentifier: '5bc768db-919f-41da-8c43-df08084d526f',
    },
  },
  messageThread: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThread,
    ),
    messages: {
      universalIdentifier: '20202020-3115-404f-aade-e1154b28e35a',
    },
    messageChannelMessageAssociations: {
      universalIdentifier: '20202020-314e-40a4-906d-a5d5d6c285f6',
    },
    subject: {
      universalIdentifier: 'a8ddbf8c-1137-45d1-b89e-5ffbd83f67c8',
    },
    messageThreadTargets: {
      universalIdentifier: '8d7c8b17-b835-4082-96bd-de704c491d49',
    },
  },
  messageThreadTarget: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThreadTarget,
    ),
    messageThread: {
      universalIdentifier: '23ca09e6-149d-452f-bed7-a4aad24d1314',
    },
    isAutomaticallyAssigned: {
      universalIdentifier: '04403730-e960-415a-8790-f0c0f82f3477',
    },
    isManuallyAssigned: {
      universalIdentifier: '16efa36f-d195-42e9-959f-6928164f2395',
    },
    targetPerson: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThreadTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
      }),
    },
    targetCompany: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThreadTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
      }),
    },
    targetOpportunity: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThreadTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
      }),
    },
  },
  message: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.message,
    ),
    headerMessageId: {
      universalIdentifier: '20202020-72b5-416d-aed8-b55609067d01',
    },
    messageThread: {
      universalIdentifier: '20202020-30f2-4ccd-9f5c-e41bb9d26214',
    },
    subject: { universalIdentifier: '20202020-52d1-4036-b9ae-84bd722bb37a' },
    text: { universalIdentifier: '20202020-d2ee-4e7e-89de-9a0a9044a143' },
    receivedAt: {
      universalIdentifier: '20202020-140a-4a2a-9f86-f13b6a979afc',
    },
    messageParticipants: {
      universalIdentifier: '20202020-7cff-4a74-b63c-73228448cbd9',
    },
    messageChannelMessageAssociations: {
      universalIdentifier: '20202020-3cef-43a3-82c6-50e7cfbc9ae4',
    },
    messageCampaign: {
      universalIdentifier: '77cff00b-a0ba-48d6-80de-0d5ccf14e45b',
    },
    isDraft: {
      universalIdentifier: '20202020-4d3a-4b6e-9c1f-2a5e7b9d0c34',
    },
  },
  note: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.note,
    ),
    title: { universalIdentifier: '20202020-faeb-4c76-8ba6-ccbb0b4a965f' },
    bodyV2: { universalIdentifier: '20202020-a7bb-4d94-be51-8f25181502c8' },
    noteTargets: {
      universalIdentifier: '20202020-1f25-43fe-8b00-af212fdde823',
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.note,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.note,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  noteTarget: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
    ),
    note: { universalIdentifier: '20202020-57f3-4f50-9599-fc0f671df003' },
    targetPerson: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
      }),
    },
    targetCompany: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
      }),
    },
    targetOpportunity: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
      }),
    },
    targetRequirement: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
      }),
    },
    targetCandidate: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
      }),
    },
    targetSubmission: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
      }),
    },
    targetInterview: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
      }),
    },
    targetTeam: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
      }),
    },
    targetLocation: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
      }),
    },
    targetEmployee: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
      }),
    },
    targetInvoice: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
      }),
    },
  },
  opportunity: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
    ),
    name: { universalIdentifier: '20202020-8609-4f65-a2d9-44009eb422b5' },
    amount: { universalIdentifier: '20202020-583e-4642-8533-db761d5fa82f' },
    closeDate: {
      universalIdentifier: '20202020-527e-44d6-b1ac-c4158d307b97',
    },
    stage: { universalIdentifier: '20202020-6f76-477d-8551-28cd65b2b4b9' },
    pointOfContact: {
      universalIdentifier: '20202020-8dfb-42fc-92b6-01afb759ed16',
    },
    company: { universalIdentifier: '20202020-cbac-457e-b565-adece5fc815f' },
    owner: { universalIdentifier: '20202020-be7e-4d1e-8e19-3d5c7c4b9f2a' },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    calendarEventTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventTarget,
      }),
    },
    messageThreadTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThreadTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
    requirements: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
      }),
    },
    invoices: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
      }),
    },
  },
  person: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
    ),
    name: { universalIdentifier: '20202020-3875-44d5-8c33-a6239011cab8' },
    emails: { universalIdentifier: '20202020-3c51-43fa-8b6e-af39e29368ab' },
    linkedinLink: {
      universalIdentifier: '20202020-f1af-48f7-893b-2007a73dd508',
    },
    jobTitle: { universalIdentifier: '20202020-b0d0-415a-bef9-640a26dacd9b' },
    phones: { universalIdentifier: '20202020-0638-448e-8825-439134618022' },
    avatarUrl: {
      universalIdentifier: '20202020-b8a6-40df-961c-373dc5d2ec21',
    },
    avatarFile: {
      universalIdentifier: '20202020-a7c9-4e3d-8f1b-2d5a6b7c8e9f',
    },
    company: { universalIdentifier: '20202020-e2f3-448e-b34c-2d625f0025fd' },
    pointOfContactForOpportunities: {
      universalIdentifier: '20202020-911b-4a7d-b67b-918aa9a5b33a',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    calendarEventTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventTarget,
      }),
    },
    messageThreadTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThreadTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    messageParticipants: {
      universalIdentifier: '20202020-498e-4c61-8158-fa04f0638334',
    },
    calendarEventParticipants: {
      universalIdentifier: '20202020-52ee-45e9-a702-b64b3753e3a9',
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
    listMemberships: {
      universalIdentifier: '8b8d1be0-4c94-4413-a2c9-c7ede205a81d',
    },
    candidateProfiles: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
      }),
    },
    requirements: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
      }),
    },
    employees: {
      universalIdentifier: '9a53d580-4e28-4861-aceb-9ffb6cd71d44',
    },
  },
  recordShare: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.recordShare,
    ),
    recordId: {
      universalIdentifier: '01edb657-6339-475c-b581-784a0c3e0509',
    },
    objectMetadataId: {
      universalIdentifier: '504cec47-6aae-4e5b-85fd-1581b62602e3',
    },
    principalId: {
      universalIdentifier: 'c1849ee2-1d2a-409e-800d-16fc16621257',
    },
    principalType: {
      universalIdentifier: '556161f6-1a01-478e-8f01-acc413102e44',
    },
    accessLevel: {
      universalIdentifier: '943b9926-9620-43de-8a46-8ebfee74dea3',
    },
    rowCause: {
      universalIdentifier: 'be27640e-f739-4d07-8979-dba4526e406a',
    },
    sourceId: {
      universalIdentifier: '534a2244-9feb-4d21-afd9-c9a20052b300',
    },
  },
  task: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task,
    ),
    title: { universalIdentifier: '20202020-b386-4cb7-aa5a-08d4a4d92680' },
    bodyV2: { universalIdentifier: '20202020-4aa0-4ae8-898d-7df0afd47ab1' },
    dueAt: { universalIdentifier: '20202020-fd99-40da-951b-4cb9a352fce3' },
    status: { universalIdentifier: '20202020-70bc-48f9-89c5-6aa730b151e0' },
    taskTargets: {
      universalIdentifier: '20202020-de9c-4d0e-a452-713d4a3e5fc7',
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    assignee: { universalIdentifier: '20202020-065a-4f42-a906-e20422c1753f' },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  taskTarget: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
    ),
    task: { universalIdentifier: '20202020-e881-457a-8758-74aaef4ae78a' },
    targetPerson: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
      }),
    },
    targetCompany: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
      }),
    },
    targetOpportunity: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
      }),
    },
    targetRequirement: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
      }),
    },
    targetCandidate: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
      }),
    },
    targetSubmission: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
      }),
    },
    targetInterview: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
      }),
    },
    targetTeam: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
      }),
    },
    targetLocation: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
      }),
    },
    targetEmployee: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
      }),
    },
    targetInvoice: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
      }),
    },
  },
  workflow: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflow,
    ),
    name: { universalIdentifier: '20202020-b3d3-478f-acc0-5d901e725b20' },
    lastPublishedVersionId: {
      universalIdentifier: '20202020-326a-4fba-8639-3456c0a169e8',
    },
    coreWorkflowId: {
      universalIdentifier: '20202020-058a-42ad-8eb8-0662a5552aad',
    },
    statuses: { universalIdentifier: '20202020-357c-4432-8c50-8c31b4a552d9' },
    versions: { universalIdentifier: '20202020-9432-416e-8f3c-27ee3153d099' },
    runs: { universalIdentifier: '20202020-759b-4340-b58b-e73595c4df4f' },
    automatedTriggers: {
      universalIdentifier: '20202020-3319-4234-a34c-117ecad2b8a9',
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflow,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflow,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
  },
  workflowAutomatedTrigger: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowAutomatedTrigger,
    ),
    type: {
      universalIdentifier: '20202020-3319-4234-a34c-3f92c1ab56e7',
    },
    settings: {
      universalIdentifier: '20202020-3319-4234-a34c-bac8f903de12',
    },
    workflow: {
      universalIdentifier: '20202020-3319-4234-a34c-8e1a4d2f7c03',
    },
  },
  workflowRun: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowRun,
    ),
    name: { universalIdentifier: '20202020-b840-4253-aef9-4e5013694587' },
    workflowVersion: {
      universalIdentifier: '20202020-2f52-4ba8-8dc4-d0d6adb9578d',
    },
    workflow: {
      universalIdentifier: '20202020-8c57-4e7f-84f5-f373f68e1b82',
    },
    enqueuedAt: {
      universalIdentifier: '20202020-f1e3-4de1-a461-b5c4fdbc861d',
    },
    startedAt: {
      universalIdentifier: '20202020-a234-4e2d-bd15-85bcea6bb183',
    },
    endedAt: { universalIdentifier: '20202020-e1c1-4b6b-bbbd-b2beaf2e159e' },
    status: { universalIdentifier: '20202020-6b3e-4f9c-8c2b-2e5b8e6d6f3b' },
    state: { universalIdentifier: '20202020-611f-45f3-9cde-d64927e8ec57' },
    stepLogs: {
      universalIdentifier: '20202020-7c4e-4e1a-8fc1-1e3a55d6c2a1',
    },
    coreWorkflowId: {
      universalIdentifier: 'e07d8ac0-6b6e-4685-81fa-50d82ae7f880',
    },
    coreWorkflowVersionId: {
      universalIdentifier: '58e3f476-425d-4c66-b391-779d0412e107',
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowRun,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  workflowVersion: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowVersion,
    ),
    name: { universalIdentifier: '20202020-a12f-4cca-9937-a2e40cc65509' },
    workflow: {
      universalIdentifier: '20202020-afa3-46c3-91b0-0631ca6aa1c8',
    },
    trigger: {
      universalIdentifier: '20202020-4eae-43e7-86e0-212b41a30b48',
    },
    status: {
      universalIdentifier: '20202020-5a34-440e-8a25-39d8c3d1d4cf',
    },
    runs: { universalIdentifier: '20202020-1d08-46df-901a-85045f18099a' },
    steps: { universalIdentifier: '20202020-5988-4a64-b94a-1f9b7b989039' },
    coreWorkflowVersionId: {
      universalIdentifier: '20202020-58b4-46e8-b6d2-f1f3c74cf7f4',
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowVersion,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  workspaceMember: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
    ),
    name: { universalIdentifier: '20202020-e914-43a6-9c26-3603c59065f4' },
    colorScheme: {
      universalIdentifier: '20202020-66bc-47f2-adac-f2ef7c598b63',
    },
    uiScale: {
      universalIdentifier: '20202020-1581-4bfb-b87d-58fa9cd5b817',
    },
    openRecordIn: {
      universalIdentifier: '20202020-1b16-419d-9323-6f3ea850e5d9',
    },
    locale: {
      universalIdentifier: '20202020-402e-4695-b169-794fa015afbe',
    },
    avatarUrl: {
      universalIdentifier: '20202020-0ced-4c4f-a376-c98a966af3f6',
    },
    userEmail: {
      universalIdentifier: '20202020-4c5f-4e09-bebc-9e624e21ecf4',
    },
    jobTitle: {
      universalIdentifier: '20202020-4dd4-4619-826e-08f6c06b374d',
    },
    userId: {
      universalIdentifier: '20202020-75a9-4dfc-bf25-2e4b43e89820',
    },
    assignedTasks: {
      universalIdentifier: '20202020-61dc-4a1c-99e8-38ebf8d2bbeb',
    },
    ownedOpportunities: {
      universalIdentifier: '20202020-9e4d-4b3a-8c1f-6d7e8f9a0b1c',
    },
    accountOwnerForCompanies: {
      universalIdentifier: '20202020-dc29-4bd4-a3c1-29eafa324bee',
    },
    messageParticipants: {
      universalIdentifier: '20202020-8f99-48bc-a5eb-edd33dd54188',
    },
    blocklist: {
      universalIdentifier: '20202020-6cb2-4161-9f29-a4b7f1283859',
    },
    calendarEventParticipants: {
      universalIdentifier: '20202020-0dbc-4841-9ce1-3e793b5b3512',
    },
    timelineActivities: {
      universalIdentifier: '20202020-e15b-47b8-94fe-8200e3c66615',
    },
    timeZone: {
      universalIdentifier: '20202020-2d33-4c21-a86e-5943b050dd54',
    },
    dateFormat: {
      universalIdentifier: '20202020-af13-4e11-b1e7-b8cf5ea13dc0',
    },
    timeFormat: {
      universalIdentifier: '20202020-8acb-4cf8-a851-a6ed443c8d81',
    },
    calendarStartDay: {
      universalIdentifier: '20202020-1ecc-4562-84c9-ff3a2f6cce85',
    },
    numberFormat: {
      universalIdentifier: '20202020-7f40-4e7f-b126-11c0eda6b141',
    },
    ownedRequirements: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
      }),
    },
    hrOwnedRequirements: {
      // Explicit literal: getSystemRelationFieldUniversalIdentifier derives
      // from (object, target) only, so three workspaceMember→requirement
      // relations would collide on the same UUID.
      universalIdentifier: '3f7d2b91-6c58-4a0e-9d24-8b1f5c7e30a2',
    },
    recruiterOwnedRequirements: {
      universalIdentifier: '7e2a9c45-d1b3-4f86-b05e-2c9d4a7f61b8',
    },
    ownedCandidates: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
      }),
    },
    submittedSubmissions: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
      }),
    },
    hrOwnedSubmissions: {
      universalIdentifier: '5b8e1f72-9a4c-4d63-a217-c6f0b3d9845e',
    },
    ownedInterviews: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
      }),
    },
    approvedPayrollAdjustments: {
      universalIdentifier: '1c9eb8e8-013e-4f3f-9899-7d3ad188c391',
    },
    onboardingItems: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.onboardingItem,
      }),
    },
    attendanceCorrections: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceCorrection,
      }),
    },
    leaveRequests: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveRequest,
      }),
    },
    departments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.department,
      }),
    },
  },
  // Achare recruitment domain (stable — never mutate a universal identifier)
  requirement: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
    ),
    title: { universalIdentifier: 'fac6a8aa-9192-408e-b143-d7221ba4b6c2' },
    rolePosition: {
      universalIdentifier: '5fdc21c9-8e8b-4e02-b1d0-451f840565aa',
    },
    numberOfOpenings: {
      universalIdentifier: 'ba9b080a-272a-47d6-ba8d-e5641d50dac3',
    },
    filledCount: {
      universalIdentifier: '4dcdc233-03f4-46fd-9204-5eab80479088',
    },
    company: { universalIdentifier: '9e77a878-9344-476c-a390-469fb8e2055b' },
    pointOfContact: {
      universalIdentifier: '0a774851-5312-4220-a715-d5a7ba8bdea2',
    },
    deal: { universalIdentifier: 'd54cb9c5-4543-4367-93df-bd2cb89e2653' },
    location: { universalIdentifier: 'f665c864-a6aa-4afd-a5ff-9fae1d78fd87' },
    workMode: { universalIdentifier: 'a9d03ef8-3a10-48ab-b467-679e871f1458' },
    employmentType: {
      universalIdentifier: 'aeac0dc0-aa65-4ca4-90cc-3b30a6b59ee1',
    },
    experienceMin: {
      universalIdentifier: '06efc617-7084-404f-9589-0f37bbcbf668',
    },
    experienceMax: {
      universalIdentifier: '508befc8-c8ab-4e19-b3a0-76a9f3784b99',
    },
    salaryMin: { universalIdentifier: '431830b3-4fcb-4a1d-a66f-3ccf1386a54e' },
    salaryMax: { universalIdentifier: '132f7d3e-07f5-4d70-8a22-1d5b664e40d6' },
    skills: { universalIdentifier: '335b1b34-8497-424a-8d9d-dde4c00bd7cf' },
    education: { universalIdentifier: '09b5bc1f-2fca-47a7-9161-902ad4986e99' },
    description: {
      universalIdentifier: 'fcb3622a-f288-4e2f-87c9-93b4ca198383',
    },
    responsibilities: {
      universalIdentifier: 'fb244c28-7d10-47bc-82bd-dadbdfe51621',
    },
    requirementsText: {
      universalIdentifier: 'add8bcc3-9cc7-41c8-aeb6-86858c0ac1c6',
    },
    priority: { universalIdentifier: 'a4fdc3e4-ca32-41d6-af98-5e15e2e53f83' },
    status: { universalIdentifier: 'fbd0b4ff-39c9-4e69-9529-fee9813a0b5f' },
    bdeOwner: { universalIdentifier: '2fad5cd6-a893-447e-bd82-7c86939fbb58' },
    hrOwner: { universalIdentifier: '086b8106-6c69-45de-8dc1-4d80164322c8' },
    recruiterOwner: {
      universalIdentifier: '107c478a-5860-422d-be2e-19852bbab41a',
    },
    receivedAt: {
      universalIdentifier: '6ab5a3d1-2e27-4d51-80f0-aa1976178538',
    },
    targetDate: {
      universalIdentifier: 'c866e970-8b83-4b46-bd13-63a2c8da00e8',
    },
    closedAt: { universalIdentifier: '941c95f7-e0a5-4882-a355-a8db200b0028' },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
    candidateSubmissions: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
      }),
    },
    interviews: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
      }),
    },
    invoices: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
      }),
    },
  },
  candidate: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
    ),
    name: { universalIdentifier: '7966163a-8059-41e7-b74f-bab4c7a176d4' },
    person: { universalIdentifier: 'a6f08d76-c6c3-4178-bfac-9a34feef93bb' },
    source: { universalIdentifier: '3a50fed5-e39a-40a7-b819-6f6983ee5c43' },
    skills: { universalIdentifier: 'b08aeb7d-bc38-4072-8757-6cf12cf9d5e0' },
    totalExperienceYears: {
      universalIdentifier: '1a8efcd7-6027-45a7-88e4-ab29cf61716e',
    },
    currentCompany: {
      universalIdentifier: '84990e88-20be-4e20-949c-dd4b15591c1a',
    },
    currentDesignation: {
      universalIdentifier: 'cdd95eca-5202-4d20-9083-10d8e494adb9',
    },
    currentSalary: {
      universalIdentifier: '26dec8fb-dd39-4f41-8b91-0458e071c1cd',
    },
    expectedSalary: {
      universalIdentifier: '01dab3c4-ac19-4346-a504-771bab13d2c4',
    },
    noticePeriod: {
      universalIdentifier: '21898d4b-5fd3-418c-9dae-d0d1489df420',
    },
    preferredLocation: {
      universalIdentifier: '5f4e2f34-fab4-4723-b5cf-2a8a6c3512f1',
    },
    recruiterOwner: {
      universalIdentifier: '8938fa35-1ba7-4a2e-9bb3-25cc64226709',
    },
    status: { universalIdentifier: 'a2663c31-a0f5-4771-8766-6e80c0942da3' },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
    candidateSubmissions: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
      }),
    },
    interviews: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
      }),
    },
  },
  candidateSubmission: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
    ),
    name: { universalIdentifier: 'c3fb9a17-bdca-4d12-b51f-94b668714a89' },
    candidate: {
      universalIdentifier: '9553ae7e-2a92-4f34-8dec-a12331d3333e',
    },
    requirement: {
      universalIdentifier: '3eebb343-036f-4b94-8f30-56743c398b7e',
    },
    recruiter: { universalIdentifier: '45cfaca1-fb0e-485f-a4c1-5bf946c47dff' },
    hrOwner: { universalIdentifier: '4a7e1835-2602-4748-a85b-8e93bad63357' },
    stage: { universalIdentifier: 'fbb90879-0349-41b1-a1ea-57c5a1b9bdef' },
    resumeSent: {
      universalIdentifier: '95b7b675-e815-480d-8de3-46d449aef2f8',
    },
    clientFeedback: {
      universalIdentifier: 'ddbf684f-497d-483a-876c-d9a7c44d10fd',
    },
    expectedSalary: {
      universalIdentifier: 'b34514ba-9323-47f8-be2d-0be56332b2db',
    },
    offeredSalary: {
      universalIdentifier: '7db9cc5b-867b-47d3-ac7c-7613607c6e01',
    },
    joiningDate: {
      universalIdentifier: '78510818-c52b-450f-923d-eb8465e8dee7',
    },
    rejectionReason: {
      universalIdentifier: 'b17eb1de-c133-4ff9-bae8-96e7f42d3d9f',
    },
    dropReason: {
      universalIdentifier: '48f7b432-2728-4f9b-9b6c-6a0d7bd38cfc',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
    interviews: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
      }),
    },
  },
  interview: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
    ),
    title: { universalIdentifier: 'f0aa68ed-d40f-422b-ac90-c52ce24737d8' },
    submission: {
      universalIdentifier: 'ae2619f3-9293-4fd1-a194-2bb41937062a',
    },
    requirement: {
      universalIdentifier: '22479f65-fb10-468e-aced-798a63ebd994',
    },
    candidate: {
      universalIdentifier: '5d942e38-4fbc-483f-b852-3bec3e622055',
    },
    company: { universalIdentifier: 'cb721d40-5887-4ce8-bbec-bdbae68fee32' },
    round: { universalIdentifier: '2a5575dc-5bf1-44e2-b5eb-6e80de0ec542' },
    interviewer: {
      universalIdentifier: '90a1a8bb-469a-4b06-872a-93e3e40f35d2',
    },
    scheduledAt: {
      universalIdentifier: '5a9d3fce-b067-4cb1-bf77-e58a08630368',
    },
    mode: { universalIdentifier: '659b1e0b-072b-4b31-bb9b-62da06e6b650' },
    meetingLink: {
      universalIdentifier: '2b7785a3-7b74-4ab9-8547-137148f340ab',
    },
    status: { universalIdentifier: '89d6c955-4d7b-4ce4-81af-f9c3fdfd0b54' },
    result: { universalIdentifier: '4d2f1eb3-9331-4af8-9be9-f07af035748d' },
    feedback: { universalIdentifier: 'df483513-4502-4639-ba73-0f0bba7c09f8' },
    owner: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
      }),
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  designation: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.designation,
    ),
    title: {
      universalIdentifier: 'c3d4e5f6-0001-4000-8000-000000000001',
    },
    description: {
      universalIdentifier: 'c3d4e5f6-0001-4000-8000-000000000002',
    },
    level: {
      universalIdentifier: 'c3d4e5f6-0001-4000-8000-000000000003',
    },
    status: {
      universalIdentifier: 'c3d4e5f6-0001-4000-8000-000000000004',
    },
    employees: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.designation,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
      }),
    },
  },
  employee: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
    ),
    employeeCode: {
      universalIdentifier: '0d0257ae-609b-4c7f-8e46-704da72cd017',
    },
    person: {
      universalIdentifier: '3ccc0ea0-5adb-401d-8d12-d54df4fcf693',
    },
    status: {
      universalIdentifier: 'd893b0e5-65ab-4b0f-84d8-0df963eea4dd',
    },
    department: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.department,
      }),
    },
    designation: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.designation,
      }),
    },
    employmentType: {
      universalIdentifier: '22785094-b2f6-45cc-80f0-99a64e7097eb',
    },
    joiningDate: {
      universalIdentifier: '883b8572-7730-44a0-8e43-353c1dd875ec',
    },
    exitDate: {
      universalIdentifier: '0dee5bb5-33f8-4576-8965-4bc20e848201',
    },
    workLocation: {
      universalIdentifier: '5093b3e3-d569-4642-85ae-ee866e66244f',
    },
    team: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
      }),
    },
    location: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
      }),
    },
    manager: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
      }),
    },
    onboardingItems: {
      universalIdentifier: 'add1706f-4a67-47fc-8106-8471da201a6e',
    },
    rosterAssignments: {
      universalIdentifier: 'f75128a0-fcd0-41bf-8489-aa66bbd8ad88',
    },
    attendanceDays: {
      universalIdentifier: '9d6ee019-5459-439d-8140-aba3e0a9c451',
    },
    attendanceEvents: {
      universalIdentifier: '51b3d8c4-323f-4ca2-8117-e30611578c81',
    },
    attendanceCorrections: {
      universalIdentifier: '27f20624-8766-4ca0-8ab6-342e90a89741',
    },
    leaveRequests: {
      universalIdentifier: 'c783573a-caaf-4f73-8bc7-d3afbed77461',
    },
    leaveBalances: {
      universalIdentifier: '6207243a-8487-4f6b-8675-29d741f11c8a',
    },
    salaryStructures: {
      universalIdentifier: '1f98057b-f49b-42fd-8771-518c8c55b6cf',
    },
    payslips: {
      universalIdentifier: 'b0339fbf-54b6-468d-8fac-a50858dd560d',
    },
    payrollAdjustments: {
      universalIdentifier: '35bc4fd9-ec4c-4f09-8fb9-c1108d747776',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  onboardingItem: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.onboardingItem,
    ),
    title: {
      universalIdentifier: '28df0cb6-bdb4-47ee-89c5-f39d8eb92a90',
    },
    employee: {
      universalIdentifier: 'f0b2ca73-5ea2-42cf-8c44-a8041e621a60',
    },
    category: {
      universalIdentifier: 'dd2798cb-a9e4-4ec4-8636-6949947ddb39',
    },
    isRequired: {
      universalIdentifier: 'ff7e8cb3-5b1f-473b-8f18-4bf664b5a4ae',
    },
    assignedTo: {
      universalIdentifier: '783fbbc7-9667-4042-8e34-80d6e9321f77',
    },
    dueDate: {
      universalIdentifier: '008eeb8e-41b9-48e8-8615-6157530b2135',
    },
    status: {
      universalIdentifier: 'ee651b75-5667-4325-8ab2-2db67c4539af',
    },
    completedAt: {
      universalIdentifier: '8d2fbb98-fd87-416f-87b9-a1a894cfbdd5',
    },
    notes: {
      universalIdentifier: 'b3234d49-9acf-4fd1-817e-eba09657eba7',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.onboardingItem,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.onboardingItem,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.onboardingItem,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.onboardingItem,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  shift: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.shift,
    ),
    name: {
      universalIdentifier: '376a13f7-7114-4028-841d-e9c8deb91718',
    },
    startTime: {
      universalIdentifier: '3debbccd-5f12-4088-800e-1ff935d1ad18',
    },
    endTime: {
      universalIdentifier: '62e1baba-60f5-4c53-84b3-86e2fa20b526',
    },
    breakMinutes: {
      universalIdentifier: '3b989400-c54e-405a-8d89-8979fdfc4078',
    },
    graceMinutes: {
      universalIdentifier: 'bf77f236-00de-44d2-855f-0ecddce3544c',
    },
    workingDays: {
      universalIdentifier: '34eb29ec-8bff-4ad0-8e53-f885aaefb4d7',
    },
    isActive: {
      universalIdentifier: 'c4dc7c66-c89f-4c41-8d94-041bff5e5650',
    },
    rosterAssignments: {
      universalIdentifier: '2a8f6288-2237-4c91-8fc6-d30f6879b94d',
    },
    attendanceDays: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.shift,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceDay,
      }),
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.shift,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.shift,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.shift,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.shift,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  rosterAssignment: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.rosterAssignment,
    ),
    employee: {
      universalIdentifier: '16f64b76-d43b-4093-8d57-f4202766af41',
    },
    shift: {
      universalIdentifier: 'f9307eec-9ee2-4ebb-8b5f-9fb0f359a9f7',
    },
    effectiveFrom: {
      universalIdentifier: '60358aa4-346c-461d-869f-4f58ea1ffa97',
    },
    effectiveTo: {
      universalIdentifier: '4c7dfebe-80a0-46dc-8862-8aa240d06185',
    },
    isActive: {
      universalIdentifier: '415d1679-c112-48b2-8f76-7f8d278a991b',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.rosterAssignment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.rosterAssignment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.rosterAssignment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.rosterAssignment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  attendanceEvent: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceEvent,
    ),
    employee: {
      universalIdentifier: 'ea31c4c9-c80c-4ed4-8532-bc786bdefa92',
    },
    timestamp: {
      universalIdentifier: 'e3ad0c28-c340-4b88-89b4-329b896c083c',
    },
    eventType: {
      universalIdentifier: 'ee4e74e9-a143-447f-88e3-0918ec541ab1',
    },
    source: {
      universalIdentifier: '5b3b844f-d5f8-4665-8e93-545fd36eb160',
    },
    correction: {
      universalIdentifier: '0e94cdb4-2a13-405d-8a67-7cdb33f0b95e',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceEvent,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceEvent,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceEvent,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceEvent,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  attendanceDay: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceDay,
    ),
    employee: {
      universalIdentifier: '2e0e3e25-4b87-46b2-8d93-26133496b5c7',
    },
    workDate: {
      universalIdentifier: '5b04cecb-761c-41d9-8f1a-83f8de65a165',
    },
    status: {
      universalIdentifier: '45c4804f-b876-48da-8d4d-f61285a87565',
    },
    shift: {
      universalIdentifier: '0a6c2da1-4c02-401e-8a11-dead581b9fc8',
    },
    firstCheckIn: {
      universalIdentifier: '97ef3c2c-5acd-46ff-870d-9c67f6c0897c',
    },
    lastCheckOut: {
      universalIdentifier: '93f87902-a9cb-4ee4-85fb-6f5286c0cfed',
    },
    workedMinutes: {
      universalIdentifier: '5d3247cd-d16c-486c-8fd3-6d79dfb2cac9',
    },
    breakMinutes: {
      universalIdentifier: 'b3bc5481-9e9c-4a89-8181-de45cfd763ed',
    },
    lateMinutes: {
      universalIdentifier: '9b5c1f2a-0a1b-4508-8778-69cc9388abee',
    },
    earlyDepartureMinutes: {
      universalIdentifier: 'd6612e94-b239-4491-8ffc-786548c21f2c',
    },
    overtimeMinutes: {
      universalIdentifier: '5491bd80-bac3-4727-8aa0-d10062869d2c',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceDay,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceDay,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceDay,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceDay,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  attendanceCorrection: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceCorrection,
    ),
    employee: {
      universalIdentifier: 'd4702266-f4f6-4962-8bae-10e44c9c0c43',
    },
    workDate: {
      universalIdentifier: '60af8f08-f8e5-47c6-815f-8fa4a84db7e7',
    },
    requestedCheckIn: {
      universalIdentifier: '2304e09e-57aa-468b-85bd-7e2c59a90ff4',
    },
    requestedCheckOut: {
      universalIdentifier: '99d65119-1986-45b5-8cda-886c6aabd489',
    },
    reason: {
      universalIdentifier: 'd0905ac1-f064-46c2-89ea-40c700b38b4b',
    },
    status: {
      universalIdentifier: '2519307e-cce3-4ef2-8ab0-212f8e781405',
    },
    reviewedBy: {
      universalIdentifier: '8047c864-fe7d-41b3-8491-0be2d1081ab0',
    },
    reviewedAt: {
      universalIdentifier: 'a6b6f5ca-ecf3-4204-8848-00e917894b26',
    },
    reviewNotes: {
      universalIdentifier: 'c2e651fa-e3fb-46b2-8a0f-9612e20fb431',
    },
    correctedEvents: {
      universalIdentifier: 'ab68394a-bcfe-4ca1-8b58-0af35821046e',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceCorrection,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceCorrection,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceCorrection,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceCorrection,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  leaveType: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveType,
    ),
    name: {
      universalIdentifier: '281f51ec-0001-4f31-82c5-6b5c14d0896e',
    },
    isPaid: {
      universalIdentifier: '3423ef72-21f8-4204-802f-4380a5600ad3',
    },
    annualQuota: {
      universalIdentifier: '977765c1-c1e9-4d54-8c8b-b1b4febec7ce',
    },
    isActive: {
      universalIdentifier: '928c421c-d7cc-4d02-8944-d6993fb573ec',
    },
    leaveRequests: {
      universalIdentifier: '67f32022-eaf8-41a4-83fc-d632c140c6e6',
    },
    leaveBalances: {
      universalIdentifier: '71d1f0d2-d50c-4f5a-8f4e-abec3afdc8d2',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveType,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveType,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveType,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveType,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  leaveRequest: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveRequest,
    ),
    employee: {
      universalIdentifier: '4b98f1cf-012d-4212-88db-004e01fc6956',
    },
    leaveType: {
      universalIdentifier: 'b3b95167-240f-4964-88f3-1a0fa8ea5a74',
    },
    startDate: {
      universalIdentifier: '51f1b224-f4ef-4de2-8a2e-c969f05603e1',
    },
    endDate: {
      universalIdentifier: '514ea397-6fb7-4700-8f26-3abf152fc1aa',
    },
    days: {
      universalIdentifier: 'c87e3230-efa3-40ce-8517-af71d60828d4',
    },
    reason: {
      universalIdentifier: 'af3f38ad-6cfd-40db-8833-d05b785daad2',
    },
    status: {
      universalIdentifier: '255b20f8-b2eb-49a8-8eb3-ef36846b8396',
    },
    reviewedBy: {
      universalIdentifier: 'c62821d5-6950-4afa-822e-cd259d7abbdc',
    },
    reviewedAt: {
      universalIdentifier: '3179bab7-a3f8-432b-89ec-56e14cf46b09',
    },
    reviewNotes: {
      universalIdentifier: '4ea8bd02-fc60-4ddd-889b-6fcd37a54ab9',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveRequest,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveRequest,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveRequest,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveRequest,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  leaveBalance: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveBalance,
    ),
    employee: {
      universalIdentifier: 'de33ca50-86bf-47cb-8997-ae1ecd21b8f4',
    },
    leaveType: {
      universalIdentifier: 'd2b26480-ff2e-47bb-8830-d2e185f27e52',
    },
    year: {
      universalIdentifier: '8bc3c153-657c-4a60-82e9-67b3efc50299',
    },
    entitled: {
      universalIdentifier: '04b12af6-5979-4a6b-8d45-9cc9d3520527',
    },
    used: {
      universalIdentifier: 'b98c9f5c-e047-46fe-893a-22af01b641b2',
    },
    pending: {
      universalIdentifier: '222f7c27-4f69-4600-8964-8b3651137728',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveBalance,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveBalance,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveBalance,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveBalance,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  salaryStructure: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryStructure,
    ),
    employee: {
      universalIdentifier: 'c078f559-3a1e-47da-8a72-45e0e096302d',
    },
    effectiveFrom: {
      universalIdentifier: '87ffcf7a-b3ff-44bd-8958-7f94b2fda0ee',
    },
    effectiveTo: {
      universalIdentifier: 'd9baa8e0-cc99-41e8-86dd-a0a22e86d2f7',
    },
    currency: {
      universalIdentifier: '74cbb561-ef16-4d92-8bd2-ecbe53dca59d',
    },
    monthlyGross: {
      universalIdentifier: '443cfe55-d87d-44b1-8f61-60a151be260a',
    },
    isActive: {
      universalIdentifier: '200e4d9b-fa56-4487-8393-51d61aafb9d9',
    },
    components: {
      universalIdentifier: '3946bc65-62e1-4553-830f-9f4381a4bea4',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryStructure,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryStructure,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryStructure,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryStructure,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  salaryComponent: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryComponent,
    ),
    salaryStructure: {
      universalIdentifier: '04591518-2643-429b-810d-3479d403fd98',
    },
    name: {
      universalIdentifier: 'ae5d91ea-13f6-48db-8626-baee442c17bd',
    },
    componentType: {
      universalIdentifier: '368c46b4-8488-4cb1-8527-d2f546fc6af6',
    },
    calculationType: {
      universalIdentifier: '464d3d26-db38-4ae3-80ff-1fcbf81eef07',
    },
    amount: {
      universalIdentifier: '61c25309-dd29-496a-8bd4-590fd57d42e1',
    },
    percentage: {
      universalIdentifier: 'f7c73e9f-9b60-4a0a-88ee-1cea9c7577ea',
    },
    position: {
      universalIdentifier: 'fc7a7937-9b9d-4a5e-8089-32ab15709bec',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryComponent,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryComponent,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryComponent,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryComponent,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  payrollPeriod: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollPeriod,
    ),
    name: {
      universalIdentifier: '1bdebf87-7878-4634-8597-1202fb5c8f51',
    },
    startDate: {
      universalIdentifier: '7beec81a-5d30-4029-8be7-f93a8dbce014',
    },
    endDate: {
      universalIdentifier: '3d949dc9-5551-4f7d-8bfa-f5d9b263d945',
    },
    payDate: {
      universalIdentifier: 'bdfef5a8-4bb0-4883-859b-73a72b2516e2',
    },
    status: {
      universalIdentifier: '07c42b92-8025-4129-89a5-5a944f430c66',
    },
    employeeCount: {
      universalIdentifier: '1e4def32-f53b-4cc6-8135-612062725234',
    },
    totalGross: {
      universalIdentifier: '8006af23-74a7-4e80-8abb-52810c3898cf',
    },
    totalDeductions: {
      universalIdentifier: '3d2ab627-8d4a-42d9-813b-d2a6d7ab29a9',
    },
    totalAdjustments: {
      universalIdentifier: 'c19d5d1d-adab-4d44-8563-b39eb4cfc022',
    },
    totalNet: {
      universalIdentifier: 'ee3947da-df4e-4aa6-8ec0-8984b6ac6a15',
    },
    payslips: {
      universalIdentifier: 'ee4ad5e4-99fa-4741-8ade-6d29a74165cb',
    },
    payrollAdjustments: {
      universalIdentifier: '5705e51a-87fd-4e2f-acce-7dce85757a41',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollPeriod,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollPeriod,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollPeriod,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollPeriod,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  payslip: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslip,
    ),
    payrollPeriod: {
      universalIdentifier: 'aeb9348c-8dfb-4c51-8e3c-6939e0d81efd',
    },
    employee: {
      universalIdentifier: '7c97ce1a-772a-4dd7-8868-6c0b740d2c4c',
    },
    currency: {
      universalIdentifier: '54fca65f-6f0b-4464-8d77-7fefc78ed1b7',
    },
    grossEarnings: {
      universalIdentifier: '767e2d6d-9111-4785-8e08-539496164e78',
    },
    totalDeductions: {
      universalIdentifier: 'eb5d724f-d38f-4eb3-816f-8106de7f51f5',
    },
    totalAdjustments: {
      universalIdentifier: '52e4aea5-1480-40ed-8b41-754fa1aadd3e',
    },
    netPay: {
      universalIdentifier: '3f4db2d9-9c12-4db5-8242-ae182ecb0875',
    },
    workingDays: {
      universalIdentifier: '5e84afc2-223a-4423-8b49-c1ee912d123a',
    },
    presentDays: {
      universalIdentifier: '8f35b6fc-2a28-4fd5-8d3e-8ec6c531f65a',
    },
    paidLeaveDays: {
      universalIdentifier: '4576f870-5750-4754-8d9c-2411d1057f61',
    },
    unpaidLeaveDays: {
      universalIdentifier: '4142a961-cf41-4189-803c-d1b3ff34d75f',
    },
    overtimeMinutes: {
      universalIdentifier: '8253fa20-ee96-4c11-8a94-461ebab9e79f',
    },
    paymentStatus: {
      universalIdentifier: '2ef654ea-2a51-493f-8197-8fc632f58c84',
    },
    paidAt: {
      universalIdentifier: '8791e52b-36dc-4083-8763-fb44952066e9',
    },
    paymentReference: {
      universalIdentifier: '19280eff-be4c-4bf8-851f-b9ae1f807526',
    },
    paymentMethod: {
      universalIdentifier: 'ef0874ad-ebe0-470f-886a-f3ecb15fa4a3',
    },
    lines: {
      universalIdentifier: 'da1bee74-8da3-465f-8bb6-267d678a65be',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslip,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslip,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslip,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslip,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  payslipLine: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslipLine,
    ),
    payslip: {
      universalIdentifier: 'af57b042-12d8-4a2b-8176-36c1a9445f49',
    },
    label: {
      universalIdentifier: 'c19bf207-22b7-4fce-8cc6-53677e3fd418',
    },
    lineType: {
      universalIdentifier: '6ce7fb45-5589-4c8d-8748-aaadf1092db9',
    },
    amount: {
      universalIdentifier: '70cb6aaf-031a-45f8-871d-204309373b17',
    },
    notes: {
      universalIdentifier: '3040cabb-c22d-4e62-8278-baf97777ab7f',
    },
    position: {
      universalIdentifier: 'ac6ce73c-071e-4120-8de9-6c604b86e77b',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslipLine,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslipLine,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslipLine,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslipLine,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  payrollAdjustment: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollAdjustment,
    ),
    employee: {
      universalIdentifier: '25fe43e5-39a0-417d-83f2-8271c5bca541',
    },
    payrollPeriod: {
      universalIdentifier: 'eb95c0c6-a0ca-4455-8bb8-4c45244f2cf1',
    },
    adjustmentType: {
      universalIdentifier: '10e35b79-03d2-4021-8e80-0d178e347439',
    },
    amount: {
      universalIdentifier: 'a444f912-fc7c-4a72-86c9-de541d427c24',
    },
    reason: {
      universalIdentifier: '78fcd68f-067c-4cf0-814e-8bc953428655',
    },
    status: {
      universalIdentifier: '17cccbcb-755c-47be-8f6e-edb0c7b46cae',
    },
    approvedBy: {
      universalIdentifier: 'f7a50167-a08d-4027-8f9a-797b9e6103ec',
    },
    approvedAt: {
      universalIdentifier: '384e7eb2-754e-4211-8cb9-3a6b7a16a16d',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollAdjustment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollAdjustment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollAdjustment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollAdjustment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  invoice: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
    ),
    invoiceNumber: {
      universalIdentifier: '5c8125d5-276f-473e-8e0f-79cee3d19347',
    },
    company: {
      universalIdentifier: 'bf0f1979-0fd9-4aa9-8f64-5aaff1406494',
    },
    deal: {
      universalIdentifier: '71d16bdf-62e2-4b63-8b95-1f8c36e93edd',
    },
    requirement: {
      universalIdentifier: 'c00d7bf5-1c1d-4e84-8f1c-3eef31bb2041',
    },
    amount: {
      universalIdentifier: 'd6a65ec4-d490-479d-87c2-1d0cf02e5c1e',
    },
    invoiceDate: {
      universalIdentifier: 'a5bed69f-d8d0-4810-84da-678edd233665',
    },
    dueDate: {
      universalIdentifier: '983a7f2a-38ea-48bf-8eb8-3c0fa87efd95',
    },
    status: {
      universalIdentifier: '83555fef-aa9a-4577-8b26-706212987b64',
    },
    amountPaid: {
      universalIdentifier: '4c232172-d8be-4077-842f-c94e4c187611',
    },
    outstanding: {
      universalIdentifier: 'f2809acc-72bd-4b1b-8095-6b0f73ce0c4f',
    },
    notes: {
      universalIdentifier: 'f76d46c4-c187-42bd-859b-547d269a4bc3',
    },
    payments: {
      universalIdentifier: 'a15fc89a-dafd-48d4-8f65-375d69ae0f10',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  department: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.department,
    ),
    name: {
      universalIdentifier: '2f2d6c8c-bd93-5552-b9b2-a507979bccbe',
    },
    description: {
      universalIdentifier: '967dd583-cf47-5032-a865-d2fd39ad4109',
    },
    status: {
      universalIdentifier: '9062fcd0-4af0-54c7-9059-1798b10c7fcb',
    },
    departmentHead: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.department,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
      }),
    },
    employees: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.department,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
      }),
    },
  },
  payment: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payment,
    ),
    invoice: {
      universalIdentifier: 'cd8c5ac4-6137-4cf0-8bad-705a870115bd',
    },
    amount: {
      universalIdentifier: 'cc1a9efc-77b3-49ff-8f9d-28945817ae93',
    },
    paidDate: {
      universalIdentifier: '73640177-0b65-4a7e-8eb3-ee5e9f204092',
    },
    method: {
      universalIdentifier: '4b761d6f-8204-4863-8c6b-dd85bf815dce',
    },
    reference: {
      universalIdentifier: '7c6d64ec-2a24-41fc-835f-afc4afb71a1e',
    },
    notes: {
      universalIdentifier: '35d0a79a-de3d-43e0-8008-5b3757cc2d9d',
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payment,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  location: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
    ),
    name: {
      universalIdentifier: '9a4cd88f-0fd9-5d79-b7b4-9c2019a65444',
    },
    address: {
      universalIdentifier: 'a5744837-651a-51b5-8a84-3b56084f2e72',
    },
    city: {
      universalIdentifier: '8645abab-8848-5d10-8961-bbe091d9ec73',
    },
    state: {
      universalIdentifier: '9f44b319-feb9-5c3a-9d32-e2778efa54ec',
    },
    country: {
      universalIdentifier: '185e58b8-af93-57c4-94ab-7b56ff000f2d',
    },
    timezone: {
      universalIdentifier: 'f8205b1e-0862-5889-90bf-47ce62d51685',
    },
    status: {
      universalIdentifier: '2d2e8d8a-d039-5b1e-807d-d13ef8f4019a',
    },
    employees: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
      }),
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
  team: {
    ...buildStandardObjectSystemFields(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
    ),
    name: {
      universalIdentifier: 'b2c3d4e5-f6a7-8901-bcde-f12345678910',
    },
    description: {
      universalIdentifier: 'b2c3d4e5-f6a7-8901-bcde-f12345678911',
    },
    status: {
      universalIdentifier: 'b2c3d4e5-f6a7-8901-bcde-f12345678912',
    },
    department: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.department,
      }),
    },
    teamLead: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
      }),
    },
    members: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
      }),
    },
    taskTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
      }),
    },
    noteTargets: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
      }),
    },
    attachments: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
      }),
    },
    timelineActivities: {
      universalIdentifier: getSystemRelationFieldUniversalIdentifier({
        applicationUniversalIdentifier:
          TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
        relationTargetObjectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
      }),
    },
  },
} satisfies Record<string, Record<string, { universalIdentifier: string }>>;
