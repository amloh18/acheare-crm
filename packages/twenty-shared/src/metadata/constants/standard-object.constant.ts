import { STANDARD_OBJECT_FIELDS } from '@/metadata/constants/standard-object-fields.constant';
import { STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from '@/metadata/constants/standard-object-universal-identifiers.constant';
import { buildStandardObjectIndexView } from '@/metadata/utils/internal/build-standard-object-index-view.util';
import { buildStandardObjectRecordPageFieldsView } from '@/metadata/utils/internal/build-standard-object-record-page-fields-view.util';

// Achare recruitment domain: composite index universal identifiers. Generated
// once and frozen here so every workspace build derives the same value.
const ACHARE_STD_UUIDS = {
  reqByStatusView: '0d6f24c8-5936-4587-98f7-d63d13aa8bc4',
  subByStageView: '3df642c2-8957-4690-bb32-231e9a2ab3f6',
  intCalendarView: 'f22e587c-8898-449a-a3c2-2c8b6cd4de36',
  reqCompanyIdIndex: '4887c4bb-7e8c-4e60-ab02-6e176e9655fa',
  reqDealIdIndex: '629a1f71-cae7-4809-9ed2-6673cff90ca0',
  reqPointOfContactIdIndex: '810473be-be84-4304-a878-4a4efbfc10b9',
  reqBdeOwnerIdIndex: 'da823e09-ee85-4fee-8a72-f12b8a9d274e',
  reqHrOwnerIdIndex: '691d6576-8fe1-4ffd-8b01-a99060da19ca',
  reqRecruiterOwnerIdIndex: '0579aa32-a4e5-4632-9cc8-2bb5dac70fad',
  reqStatusIndex: '7aa4250f-0491-4147-87d5-aa75efdb4cdc',
  reqSearchVectorGinIndex: '5e06fef9-1e86-4abc-a864-90c2fb2e7f06',
  candPersonIdIndex: '9e608f69-fcf9-469c-9db2-c8c6ebefad80',
  candRecruiterOwnerIdIndex: '9dfda2e1-e1c0-401d-9f96-1a8f445f70d1',
  candStatusIndex: 'fc371991-a4c2-4de8-bb56-4c91568b180d',
  candSourceIndex: 'a9960f0e-8c55-43aa-9c84-fffb294754d1',
  candSearchVectorGinIndex: '9aabc5ca-cce0-4772-891e-258a2335cfa5',
  subCandidateIdIndex: '1091e1eb-39f1-4d1b-b80d-46d504494acd',
  subRequirementIdIndex: 'ec430f80-47f0-4224-a5fb-93723e87c7a3',
  subRecruiterIdIndex: '0a3ffd0c-b722-4d78-8679-f223565c7bc7',
  subHrOwnerIdIndex: '9a596c70-39eb-4811-be72-f0585e05267a',
  subStageIndex: '832f4152-8c4b-4665-9714-82f64b91ba0e',
  subCandidateRequirementUniqueIndex: 'b045aae3-b9ca-4082-9d9a-8fa6c844e8c3',
  subSearchVectorGinIndex: '75ff84eb-50fa-4683-a4b5-c1c598fad4f3',
  intSubmissionIdIndex: 'bc96be96-4b19-4c65-acb2-c898499e102e',
  intRequirementIdIndex: '4a29ccab-35e8-45ee-b169-98190aa184e2',
  intCandidateIdIndex: 'f07dd5ca-ca41-4a13-a0b7-dfd34f730113',
  intCompanyIdIndex: '09b7af4d-40f1-49ef-ba1f-1b3c3426c045',
  intScheduledAtIndex: '64b986c4-e397-4239-b41d-961be013897e',
  intStatusIndex: 'ac3c422e-8a78-440d-8704-8cc790139cb0',
  intSearchVectorGinIndex: '7738a69d-e363-40e5-b7cc-21dcc7652f9b',
  subPipelineVfName: 'f79e96bd-7d39-4213-96de-6e14e6ea2d54',
  subPipelineVfCandidate: '04f41abf-38e3-4ac0-a3ef-6bcb47399cb8',
  subPipelineVfStage: 'd3b0e79d-7779-4a5a-8e42-1f1d30de1e06',
  subPipelineVfRecruiter: '86d7b04d-c30c-46d8-bb40-a40546cc6a9c',
  subPipelineVfExpectedSalary: 'b1a2e6bd-937c-4b76-a3b2-f01fb3a06c47',
  subPipelineVfJoiningDate: '7bb277c2-2a3e-4d9f-ba95-9d20a68c8684',
  reqBoardVfTitle: 'c16060de-9e18-4e63-973e-0482e2f41c85',
  reqBoardVfCompany: 'dc9b04e9-c53a-4f86-8d02-32121ac10a83',
  reqBoardVfStatus: 'e90a2e47-f6be-46a3-9a52-56e13bbde14a',
  reqBoardVfPriority: '1cabb99e-66e0-4db4-b74f-e91b45ca1b83',
  reqBoardVfOpenings: 'd15c93de-f325-441e-b3e0-95ed0895b97b',
  reqBoardVfFilled: '0e03a95a-0504-4d40-8647-51c8df21ed79',
  reqBoardVfTargetDate: '7a51db9e-6b53-409f-9a5c-88625ca87953',
  intCalendarVfTitle: 'f0c14260-b5cc-4a44-9b96-f19e37d4a1c3',
  intCalendarVfCandidate: 'd3ad1ccb-236a-46aa-862e-e0f6b5df7ac4',
  intCalendarVfScheduledAt: 'f8bb1ac1-4e26-4c4d-84da-0d8c99c9d70c',
  intCalendarVfMode: '82a5a0a9-f79b-4a52-a095-813a5706a372',
  cprCompanyIdIndex: 'f4a5b6c7-0101-4000-8000-000000000101',
  cprPersonIdIndex: 'f4a5b6c7-0102-4000-8000-000000000102',
  cprRelationshipOwnerIdIndex: 'f4a5b6c7-0103-4000-8000-000000000103',
  cprStatusIndex: 'f4a5b6c7-0104-4000-8000-000000000104',
  cprSearchVectorGinIndex: 'f4a5b6c7-0105-4000-8000-000000000105',
  ashSubmissionIdIndex: 'f4a5b6c7-0301-4000-8000-000000000301',
  ashChangedByIdIndex: 'f4a5b6c7-0302-4000-8000-000000000302',
  ashToStageIndex: 'f4a5b6c7-0303-4000-8000-000000000303',
  ashSearchVectorGinIndex: 'f4a5b6c7-0304-4000-8000-000000000304',
  plcSubmissionIdIndex: 'f4a5b6c7-0501-4000-8000-000000000501',
  plcCandidateIdIndex: 'f4a5b6c7-0502-4000-8000-000000000502',
  plcStatusIndex: 'f4a5b6c7-0503-4000-8000-000000000503',
  plcSearchVectorGinIndex: 'f4a5b6c7-0504-4000-8000-000000000504',
  ivpInterviewIdIndex: 'f4a5b6c7-0601-4000-8000-000000000601',
  ivpPersonIdIndex: 'f4a5b6c7-0602-4000-8000-000000000602',
  ivpSearchVectorGinIndex: 'f4a5b6c7-0603-4000-8000-000000000603',
  pexPersonIdIndex: 'f4a5b6c7-0701-4000-8000-000000000701',
  pexSourceIndex: 'f4a5b6c7-0702-4000-8000-000000000702',
  pexSearchVectorGinIndex: 'f4a5b6c7-0703-4000-8000-000000000703',
} as const;

// Important notice:
// - Never ever mutate an existing universal identifier
// - Deleting an existing universal identifier should be very rare
// - Field universal identifiers live in STANDARD_OBJECT_FIELDS (see
//   standard-object-fields.constant.ts), so both an object's `fields` and its
//   INDEX view can read the same values.
// - INDEX view universal identifiers (the "All {objectLabelPlural}" table view
//   keyed on ViewKey.INDEX) and their view-field universal identifiers are
//   deterministically derived by buildStandardObjectIndexView
//   (getSystemViewUniversalIdentifier for the view,
//   getSystemViewFieldUniversalIdentifier for each view field).
// - FIELDS_WIDGET record-page view universal identifiers (keyed on
//   SYSTEM_VIEW_KEYS.FIELDS_WIDGET), their view fields and their view field groups are
//   deterministically derived by buildStandardObjectRecordPageFieldsView; the group
//   names passed there MUST match the ones the server standard view-field-group
//   builders assign.
export const STANDARD_OBJECTS = {
  attachment: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
    fields: STANDARD_OBJECT_FIELDS.attachment,
    morphIds: {
      targetMorphId: { morphId: '20202020-f634-435d-ab8d-e1168b375c69' },
    },
    indexes: {
      taskIdIndex: {
        universalIdentifier: 'b8d4f9a3-0c25-4e7b-9f6a-2d3e4c5b6f70',
      },
      noteIdIndex: {
        universalIdentifier: '9d31ea73-13b6-4e06-84ee-c66c72bf7787',
      },
      personIdIndex: {
        universalIdentifier: '55637a5a-1edc-4351-8d76-d40020bf8944',
      },
      companyIdIndex: {
        universalIdentifier: '4137ba06-184d-438f-b484-080f02a97659',
      },
      opportunityIdIndex: {
        universalIdentifier: '8cc162d1-c127-4981-878d-f78622f8f12d',
      },
      dashboardIdIndex: {
        universalIdentifier: 'c10eba2d-ff1a-4eab-9285-50481c12a003',
      },
      workflowIdIndex: {
        universalIdentifier: 'fadeab4b-79ee-4173-af79-72c51fbad888',
      },
    },
    views: {
      allAttachments: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment,
        fields: STANDARD_OBJECT_FIELDS.attachment,
        viewFieldNames: [
          'name',
          'file',
          'createdBy',
          'createdAt',
          'targetPerson',
          'targetCompany',
          'targetOpportunity',
          'targetTask',
          'targetNote',
          'targetDashboard',
          'targetWorkflow',
        ],
      }),
    },
  },
  blocklist: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.blocklist,
    fields: STANDARD_OBJECT_FIELDS.blocklist,
    indexes: {
      workspaceMemberIdIndex: {
        universalIdentifier: '4daf320e-74d0-4f24-a45a-af3a09d741cb',
      },
    },
    views: {
      allBlocklists: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.blocklist,
        fields: STANDARD_OBJECT_FIELDS.blocklist,
        viewFieldNames: ['handle', 'workspaceMember', 'createdAt'],
      }),
      blocklistRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.blocklist,
        fields: STANDARD_OBJECT_FIELDS.blocklist,
        viewFieldNames: ['workspaceMember', 'createdAt', 'createdBy'],
        viewFieldGroupNames: {
          general: 'General',
          system: 'System',
        },
      }),
    },
  },
  calendarChannelEventAssociation: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarChannelEventAssociation,
    fields: STANDARD_OBJECT_FIELDS.calendarChannelEventAssociation,
    indexes: {
      calendarChannelIdIndex: {
        universalIdentifier: 'ff6b86c1-3112-4dfa-b734-c4789111a716',
      },
      calendarEventIdIndex: {
        universalIdentifier: '47a3c8d2-9f14-4b6e-8c5d-1a2b3f4e5c69',
      },
    },
    views: {
      allCalendarChannelEventAssociations: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarChannelEventAssociation,
        fields: STANDARD_OBJECT_FIELDS.calendarChannelEventAssociation,
        viewFieldNames: [
          'calendarChannelId',
          'calendarEvent',
          'eventExternalId',
          'createdAt',
        ],
      }),
      calendarChannelEventAssociationRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarChannelEventAssociation,
          fields: STANDARD_OBJECT_FIELDS.calendarChannelEventAssociation,
          viewFieldNames: [
            'calendarChannelId',
            'calendarEvent',
            'eventExternalId',
            'createdAt',
            'createdBy',
          ],
          viewFieldGroupNames: {
            general: 'General',
            system: 'System',
          },
        }),
    },
  },
  calendarEventParticipant: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventParticipant,
    fields: STANDARD_OBJECT_FIELDS.calendarEventParticipant,
    indexes: {
      calendarEventIdIndex: {
        universalIdentifier: 'c458ad97-8b95-43de-9003-88eb68576049',
      },
      personIdIndex: {
        universalIdentifier: '30e9b75a-881f-4a85-aaf1-f2d2464be1cf',
      },
      workspaceMemberIdIndex: {
        universalIdentifier: '898aa202-428f-4a7a-a3b3-8f0a17a6658e',
      },
    },
    views: {
      allCalendarEventParticipants: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventParticipant,
        fields: STANDARD_OBJECT_FIELDS.calendarEventParticipant,
        viewFieldNames: [
          'calendarEvent',
          'handle',
          'displayName',
          'isOrganizer',
          'responseStatus',
          'person',
          'workspaceMember',
          'createdAt',
        ],
      }),
      calendarEventParticipantRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventParticipant,
          fields: STANDARD_OBJECT_FIELDS.calendarEventParticipant,
          viewFieldNames: [
            'calendarEvent',
            'handle',
            'displayName',
            'isOrganizer',
            'responseStatus',
            'person',
            'workspaceMember',
            'createdAt',
            'createdBy',
          ],
          viewFieldGroupNames: {
            general: 'General',
            system: 'System',
          },
        }),
    },
  },
  calendarEvent: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEvent,
    fields: STANDARD_OBJECT_FIELDS.calendarEvent,
    indexes: {},
    views: {
      allCalendarEvents: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEvent,
        fields: STANDARD_OBJECT_FIELDS.calendarEvent,
        viewFieldNames: [
          'title',
          'startsAt',
          'endsAt',
          'isFullDay',
          'location',
          'conferenceLink',
          'isCanceled',
          'createdAt',
        ],
      }),
      calendarEventRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEvent,
        fields: STANDARD_OBJECT_FIELDS.calendarEvent,
        viewFieldNames: [
          'title',
          'startsAt',
          'endsAt',
          'isFullDay',
          'isCanceled',
          'conferenceLink',
          'location',
          'description',
          'calendarEventTargets',
          'externalCreatedAt',
          'externalUpdatedAt',
          'iCalUid',
          'conferenceSolution',
        ],
        viewFieldGroupNames: {
          general: 'General',
          system: 'System',
        },
      }),
    },
  },
  calendarEventTarget: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.calendarEventTarget,
    fields: STANDARD_OBJECT_FIELDS.calendarEventTarget,
    morphIds: {
      targetMorphId: { morphId: '676e9f68-7b5c-41e6-b46d-2fb9527b7051' },
    },
    indexes: {
      calendarEventIdIndex: {
        universalIdentifier: 'ce1c180c-0236-4673-ad1d-359dddf59f93',
      },
      personIdIndex: {
        universalIdentifier: 'f151bc84-ba45-40cb-b064-02ef359ac17b',
      },
      companyIdIndex: {
        universalIdentifier: '30413277-505d-4f08-be38-a56257460f9f',
      },
      opportunityIdIndex: {
        universalIdentifier: '7920092d-281f-473a-8ea4-53c209b36a37',
      },
      calendarEventPersonUniqueIndex: {
        universalIdentifier: '15b9e394-d451-4186-aaf0-612f6be1ea91',
      },
      calendarEventCompanyUniqueIndex: {
        universalIdentifier: '3fa22398-6e7d-47a5-95eb-4971f9d62135',
      },
      calendarEventOpportunityUniqueIndex: {
        universalIdentifier: 'c8183b17-5dfe-4e02-8d9d-aef8e54ef07d',
      },
    },
    views: {},
  },
  callRecording: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.callRecording,
    fields: STANDARD_OBJECT_FIELDS.callRecording,
    indexes: {
      calendarEventIdIndex: {
        universalIdentifier: '8be3cc47-9352-4a1b-ad19-bb186bc0865d',
      },
    },
    views: {
      allCallRecordings: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.callRecording,
        fields: STANDARD_OBJECT_FIELDS.callRecording,
        viewFieldNames: [
          'status',
          'recordingRequestStatus',
          'title',
          'startedAt',
        ],
      }),
      callRecordingRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.callRecording,
        fields: STANDARD_OBJECT_FIELDS.callRecording,
        viewFieldNames: [
          'title',
          'status',
          'recordingRequestStatus',
          'startedAt',
          'endedAt',
          'video',
          'audio',
          'transcript',
          'summary',
        ],
        viewFieldGroupNames: {
          general: 'General',
        },
      }),
    },
  },
  company: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
    fields: STANDARD_OBJECT_FIELDS.company,
    indexes: {
      accountOwnerIdIndex: {
        universalIdentifier: 'ec2ebfc9-0c9b-4597-a87d-aa295e2d8bfe',
      },
      domainNameUniqueIndex: {
        universalIdentifier: 'dd300c61-f422-467a-91f4-de4f83c4175b',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'c3eb62df-2cc1-4cc3-b7aa-e96a4d65c633',
      },
    },
    views: {
      allCompanies: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        fields: STANDARD_OBJECT_FIELDS.company,
        viewFieldNames: [
          'name',
          'domainName',
          'createdBy',
          'accountOwner',
          'createdAt',
          'linkedinLink',
          'address',
        ],
      }),
      companyRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company,
        fields: STANDARD_OBJECT_FIELDS.company,
        viewFieldNames: [
          'domainName',
          'accountOwner',
          'annualRevenue',
          'linkedinLink',
          'address',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'people',
          'companyPersonRelationships',
          'taskTargets',
          'noteTargets',
          'opportunities',
          'attachments',
          'timelineActivities',
        ],
        viewFieldGroupNames: {
          general: 'General',
          business: 'Business',
          contact: 'Contact',
          system: 'System',
        },
      }),
    },
  },
  dashboard: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.dashboard,
    fields: STANDARD_OBJECT_FIELDS.dashboard,
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: 'e69f71aa-de0f-4b70-845f-7a8369c47928',
      },
    },
    views: {
      allDashboards: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.dashboard,
        fields: STANDARD_OBJECT_FIELDS.dashboard,
        viewFieldNames: ['title', 'createdBy', 'createdAt', 'updatedAt'],
      }),
    },
  },
  messageCampaign: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageCampaign,
    fields: STANDARD_OBJECT_FIELDS.messageCampaign,
    indexes: {
      unsubscribeTopicIdIndex: {
        universalIdentifier: 'efe8c20e-d12b-4475-969e-e86e0bbfe444',
      },
      listIdIndex: {
        universalIdentifier: '17bffd6a-714a-458d-a547-f9e2183d9520',
      },
      searchVectorGinIndex: {
        universalIdentifier: '975823ad-9b97-4f39-b2c7-fbd7d77f4bd1',
      },
    },
    views: {
      allMessageCampaigns: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageCampaign,
        fields: STANDARD_OBJECT_FIELDS.messageCampaign,
        viewFieldNames: [
          'name',
          'subject',
          'status',
          'list',
          'fromAddress',
          'sentAt',
          'sentCount',
          'deliveredCount',
          'failedCount',
          'skippedCount',
          'bouncedCount',
          'complainedCount',
          'recipients',
          'createdAt',
        ],
      }),
      messageCampaignRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageCampaign,
        fields: STANDARD_OBJECT_FIELDS.messageCampaign,
        viewFieldNames: [
          'status',
          'sentAt',
          'sentCount',
          'deliveredCount',
          'failedCount',
          'skippedCount',
          'bouncedCount',
          'complainedCount',
        ],
        viewFieldGroupNames: {
          stats: 'Stats',
        },
      }),
    },
  },
  messageList: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageList,
    fields: STANDARD_OBJECT_FIELDS.messageList,
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: '8e205171-ed74-4620-b7d2-674aab85033a',
      },
    },
    views: {
      allMessageLists: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageList,
        fields: STANDARD_OBJECT_FIELDS.messageList,
        viewFieldNames: [
          'name',
          'description',
          'members',
          'campaigns',
          'createdAt',
        ],
      }),
    },
  },
  messageListMember: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageListMember,
    fields: STANDARD_OBJECT_FIELDS.messageListMember,
    indexes: {
      listIdIndex: {
        universalIdentifier: '61188470-6dcb-4b2a-b1a9-baeb688bccae',
      },
      personListUniqueIndex: {
        universalIdentifier: 'e5497dc2-1d72-418c-a389-a0645ca0195a',
      },
    },
    views: {
      allMessageListMembers: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageListMember,
        fields: STANDARD_OBJECT_FIELDS.messageListMember,
        viewFieldNames: ['id', 'person', 'list', 'createdAt'],
      }),
    },
  },
  messageChannelMessageAssociation: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociation,
    fields: STANDARD_OBJECT_FIELDS.messageChannelMessageAssociation,
    indexes: {
      messageChannelIdIndex: {
        universalIdentifier: '9894f9a3-0225-4e7b-9f6a-23d4e2576784',
      },
      messageIdIndex: {
        universalIdentifier: '9bb24d40-60dd-4beb-8c64-a74e8c67f9ee',
      },
      messageChannelIdMessageIdUniqueIndex: {
        universalIdentifier: '1b86ece8-7ce3-4df3-8771-fd4b5d45b2f2',
      },
    },
    views: {
      allMessageChannelMessageAssociations: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociation,
        fields: STANDARD_OBJECT_FIELDS.messageChannelMessageAssociation,
        viewFieldNames: [
          'messageChannelId',
          'message',
          'messageExternalId',
          'direction',
          'createdAt',
        ],
      }),
      messageChannelMessageAssociationRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociation,
          fields: STANDARD_OBJECT_FIELDS.messageChannelMessageAssociation,
          viewFieldNames: [
            'messageChannelId',
            'message',
            'messageExternalId',
            'direction',
            'createdAt',
            'createdBy',
          ],
          viewFieldGroupNames: {
            general: 'General',
            system: 'System',
          },
        }),
    },
  },
  messageChannelMessageAssociationMessageFolder: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociationMessageFolder,
    fields:
      STANDARD_OBJECT_FIELDS.messageChannelMessageAssociationMessageFolder,
    indexes: {
      messageChannelMessageAssociationIdIndex: {
        universalIdentifier: '8e6038aa-1f79-4a84-87b5-f33caa172e98',
      },
      messageFolderIdIndex: {
        universalIdentifier: '905299c3-ca81-435d-901c-f68b87562516',
      },
      messageChannelMessageAssociationIdMessageFolderIdUniqueIndex: {
        universalIdentifier: 'a3de1788-5dff-4849-ac5a-0dabe5fab216',
      },
    },
    views: {
      allMessageChannelMessageAssociationMessageFolders:
        buildStandardObjectIndexView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociationMessageFolder,
          fields:
            STANDARD_OBJECT_FIELDS.messageChannelMessageAssociationMessageFolder,
          viewFieldNames: [
            'messageChannelMessageAssociation',
            'messageFolderId',
            'createdAt',
          ],
        }),
      messageChannelMessageAssociationMessageFolderRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageChannelMessageAssociationMessageFolder,
          fields:
            STANDARD_OBJECT_FIELDS.messageChannelMessageAssociationMessageFolder,
          viewFieldNames: [
            'messageChannelMessageAssociation',
            'messageFolderId',
            'createdAt',
            'createdBy',
          ],
          viewFieldGroupNames: {
            general: 'General',
            system: 'System',
          },
        }),
    },
  },
  messageParticipant: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageParticipant,
    fields: STANDARD_OBJECT_FIELDS.messageParticipant,
    indexes: {
      messageIdIndex: {
        universalIdentifier: 'ab0863ba-f95e-493c-b86c-56e1bc7e5bc2',
      },
      personIdIndex: {
        universalIdentifier: 'df805c2e-3bfe-4d51-8309-75e5eb4052fe',
      },
      workspaceMemberIdIndex: {
        universalIdentifier: 'ce1e3a9e-afe9-439d-abb7-6cc98a6fa405',
      },
      messageCampaignIdIndex: {
        universalIdentifier: 'e9bcdd77-cc8b-4532-833c-124dfdc8e5ff',
      },
    },
    views: {
      allMessageParticipants: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageParticipant,
        fields: STANDARD_OBJECT_FIELDS.messageParticipant,
        viewFieldNames: [
          'message',
          'role',
          'handle',
          'displayName',
          'person',
          'workspaceMember',
          'createdAt',
        ],
      }),
      messageParticipantRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageParticipant,
          fields: STANDARD_OBJECT_FIELDS.messageParticipant,
          viewFieldNames: [
            'message',
            'role',
            'displayName',
            'person',
            'workspaceMember',
            'createdAt',
            'createdBy',
          ],
          viewFieldGroupNames: {
            general: 'General',
            system: 'System',
          },
        }),
    },
  },
  messageThread: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThread,
    fields: STANDARD_OBJECT_FIELDS.messageThread,
    indexes: {},
    views: {
      allMessageThreads: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThread,
        fields: STANDARD_OBJECT_FIELDS.messageThread,
        viewFieldNames: ['subject', 'messages', 'updatedAt', 'createdAt'],
      }),
    },
  },
  messageThreadTarget: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.messageThreadTarget,
    fields: STANDARD_OBJECT_FIELDS.messageThreadTarget,
    morphIds: {
      targetMorphId: { morphId: 'e85e853d-c26e-41b3-bec0-7afc4bdbc2f7' },
    },
    indexes: {
      messageThreadIdIndex: {
        universalIdentifier: '222fdd8b-0863-4f2a-816a-29745537b6b6',
      },
      personIdIndex: {
        universalIdentifier: '280ee419-ac3c-4599-bd62-3e5cb268342c',
      },
      companyIdIndex: {
        universalIdentifier: 'b98005e4-3811-41b6-82d0-3ccd27757eba',
      },
      opportunityIdIndex: {
        universalIdentifier: '7679ee05-cf6c-40a7-9ee6-c3e8053caca5',
      },
      messageThreadPersonUniqueIndex: {
        universalIdentifier: '087f97cb-8c3c-4ea1-9556-933acde6c83b',
      },
      messageThreadCompanyUniqueIndex: {
        universalIdentifier: '30d4f1af-8b6f-4685-802f-8a7cf29f318b',
      },
      messageThreadOpportunityUniqueIndex: {
        universalIdentifier: '1dc0e37e-afb1-4e90-90b4-052374126a6a',
      },
    },
    views: {},
  },
  message: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.message,
    fields: STANDARD_OBJECT_FIELDS.message,
    indexes: {
      messageThreadIdIndex: {
        universalIdentifier: '7a05b45e-7aa6-4a7e-9bbc-299cbed53c96',
      },
      messageCampaignIdIndex: {
        universalIdentifier: '79e777ca-7008-46c5-b3a6-3108b7c7dfb6',
      },
      headerMessageIdIndex: {
        universalIdentifier: '0904b3e4-6052-4a8d-bf41-f12a27c7e34a',
      },
    },
    views: {
      allMessages: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.message,
        fields: STANDARD_OBJECT_FIELDS.message,
        viewFieldNames: [
          'subject',
          'messageThread',
          'messageParticipants',
          'receivedAt',
          'headerMessageId',
          'text',
          'createdAt',
        ],
      }),
    },
  },
  note: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.note,
    fields: STANDARD_OBJECT_FIELDS.note,
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: '8183c8d2-9114-4b6e-8c5d-12a3b14a5a13',
      },
    },
    views: {
      allNotes: buildStandardObjectIndexView({
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.note,
        fields: STANDARD_OBJECT_FIELDS.note,
        viewFieldNames: [
          'title',
          'noteTargets',
          'bodyV2',
          'createdBy',
          'createdAt',
        ],
      }),
      noteRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.note,
        fields: STANDARD_OBJECT_FIELDS.note,
        viewFieldNames: ['noteTargets', 'attachments', 'timelineActivities'],
        viewFieldGroupNames: {
          general: 'General',
        },
      }),
    },
  },
  noteTarget: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
    fields: STANDARD_OBJECT_FIELDS.noteTarget,
    morphIds: {
      targetMorphId: { morphId: '20202020-f635-435d-ab8d-e1168b375c70' },
    },
    indexes: {
      noteIdIndex: {
        universalIdentifier: '9294d9e3-0225-4c7f-9d6e-23b4c25b6b24',
      },
      personIdIndex: {
        universalIdentifier: '7c069dc0-e83b-4cd5-aaa2-cac7f3e00d80',
      },
      companyIdIndex: {
        universalIdentifier: '2d83909a-a383-4e82-b00a-8b7739f3f906',
      },
      opportunityIdIndex: {
        universalIdentifier: '0d1a59b4-cc87-4b7d-804a-656e8504f371',
      },
      notePersonUniqueIndex: {
        universalIdentifier: '29be76d1-ff4f-4f0f-b05c-f679a234e90a',
      },
      noteCompanyUniqueIndex: {
        universalIdentifier: 'e3b92659-04cf-4496-8fd4-4f32c747c26a',
      },
      noteOpportunityUniqueIndex: {
        universalIdentifier: '58002741-8aa7-4812-b7af-f4cf98dd2433',
      },
    },
    views: {
      allNoteTargets: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.noteTarget,
        fields: STANDARD_OBJECT_FIELDS.noteTarget,
        viewFieldNames: [
          'id',
          'note',
          'targetPerson',
          'targetCompany',
          'targetOpportunity',
        ],
      }),
    },
  },
  opportunity: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
    fields: STANDARD_OBJECT_FIELDS.opportunity,
    indexes: {
      pointOfContactIdIndex: {
        universalIdentifier: 'b8c2a673-a981-4357-a43d-313a358e4daa',
      },
      companyIdIndex: {
        universalIdentifier: 'e161072d-37b1-477a-b944-ef0d65289574',
      },
      stageIndex: {
        universalIdentifier: 'ae60d580-b562-44f2-a24d-7b8040063f83',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'f53fdd28-a26b-47ba-81b5-6813ad622720',
      },
    },
    views: {
      allOpportunities: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
        fields: STANDARD_OBJECT_FIELDS.opportunity,
        viewFieldNames: [
          'name',
          'amount',
          'createdBy',
          'closeDate',
          'company',
          'pointOfContact',
        ],
      }),
      byStage: {
        universalIdentifier: '20202020-a004-4a04-8a04-0aa0b1ca1ba0',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2baf',
          },
          amount: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb0',
          },
          createdBy: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb1',
          },
          closeDate: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb2',
          },
          company: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb3',
          },
          pointOfContact: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb4',
          },
        },
        viewGroups: {
          new: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf1',
          },
          screening: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf2',
          },
          meeting: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf3',
          },
          proposal: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf4',
          },
          customer: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf5',
          },
        },
      },
      opportunityRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity,
        fields: STANDARD_OBJECT_FIELDS.opportunity,
        viewFieldNames: [
          'amount',
          'closeDate',
          'stage',
          'company',
          'pointOfContact',
          'owner',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'taskTargets',
          'noteTargets',
          'attachments',
          'timelineActivities',
        ],
        viewFieldGroupNames: {
          deal: 'Deal',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  person: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
    fields: STANDARD_OBJECT_FIELDS.person,
    indexes: {
      companyIdIndex: {
        universalIdentifier: '8a265a5c-d3ae-47dc-bdf9-b42cfa2ba639',
      },
      emailsUniqueIndex: {
        universalIdentifier: '8183a8b2-9114-4f6c-8a5b-12e3f14e5e13',
      },
      searchVectorGinIndex: {
        universalIdentifier: '9294b9c3-0225-4a7d-9b6c-23f4a25f6f24',
      },
    },
    views: {
      allPeople: buildStandardObjectIndexView({
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
        fields: STANDARD_OBJECT_FIELDS.person,
        viewFieldNames: [
          'name',
          'emails',
          'createdBy',
          'company',
          'phones',
          'createdAt',
          'jobTitle',
          'linkedinLink',
          'contexts',
          'roles',
          'status',
          'city',
          'inHouse',
        ],
      }),
      personRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person,
        fields: STANDARD_OBJECT_FIELDS.person,
        viewFieldNames: [
          'emails',
          'phones',
          'company',
          'jobTitle',
          'linkedinLink',
          'avatarUrl',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'avatarFile',
          'pointOfContactForOpportunities',
          'companyPersonRelationships',
          'interviewParticipants',
          'externalIds',
          'taskTargets',
          'noteTargets',
          'attachments',
          'messageParticipants',
          'calendarEventParticipants',
          'timelineActivities',
        ],
        viewFieldGroupNames: {
          general: 'General',
          work: 'Work',
          social: 'Social',
          system: 'System',
        },
      }),
      messageListRecordPageMembers: {
        universalIdentifier: 'bef79e8e-9ef3-4458-81ed-78a299e2566f',
        viewFields: {
          name: {
            universalIdentifier: 'a4f0d7b4-3956-44a6-8bb2-df45a699609b',
          },
          emails: {
            universalIdentifier: '180e9cbb-34c2-4e27-8648-2915be88a50e',
          },
          company: {
            universalIdentifier: '3db54119-df4d-449b-91c9-22fca1e5d599',
          },
        },
        viewFilters: {
          listMembershipsListIsCurrentRecord: {
            universalIdentifier: '256dceea-a9b5-42b7-8461-a6ce62e7fa6c',
          },
        },
      },
    },
  },
  recordShare: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.recordShare,
    fields: STANDARD_OBJECT_FIELDS.recordShare,
    indexes: {
      recordPrincipalCauseSourceUniqueIndex: {
        universalIdentifier: '4580f104-47a7-4110-87a8-26cb6f63ce7b',
      },
      principalIdIndex: {
        universalIdentifier: '66fbc3d2-6126-4e29-a306-dbe9995bf062',
      },
      sourceIdIndex: {
        universalIdentifier: '21b84593-c647-40ce-bdf4-a8b4ac658f57',
      },
    },
    views: {},
  },
  task: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task,
    fields: STANDARD_OBJECT_FIELDS.task,
    indexes: {
      assigneeIdIndex: {
        universalIdentifier: 'f48fa3b1-0cec-44da-a9e5-f8a5e766637e',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'a86b32b3-01d3-4302-a152-8b7f247db7b4',
      },
    },
    views: {
      allTasks: buildStandardObjectIndexView({
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task,
        fields: STANDARD_OBJECT_FIELDS.task,
        viewFieldNames: [
          'title',
          'status',
          'taskTargets',
          'createdBy',
          'dueAt',
          'assignee',
          'bodyV2',
          'createdAt',
        ],
      }),
      assignedToMe: {
        universalIdentifier: '20202020-a007-4a07-8a07-ba5ca551aaed',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaed',
          },
          taskTargets: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaee',
          },
          createdBy: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaef',
          },
          dueAt: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf0',
          },
          assignee: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf1',
          },
          bodyV2: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf2',
          },
          createdAt: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf3',
          },
        },
        viewFilters: {
          assigneeIsMe: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf1',
          },
        },
        viewGroups: {
          todo: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf2',
          },
          inProgress: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf3',
          },
          done: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf4',
          },
          empty: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf5',
          },
        },
      },
      byStatus: {
        universalIdentifier: '20202020-a008-4a08-8a08-ba5cba51aba5',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf0',
          },
          status: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf1',
          },
          dueAt: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf2',
          },
          assignee: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf3',
          },
          createdAt: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf4',
          },
        },
        viewGroups: {
          todo: {
            universalIdentifier: '20202020-af18-4a08-8a08-ba5cba5bbf01',
          },
          inProgress: {
            universalIdentifier: '20202020-af18-4a08-8a08-ba5cba5bbf02',
          },
          done: {
            universalIdentifier: '20202020-af18-4a08-8a08-ba5cba5bbf03',
          },
        },
      },
      taskRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task,
        fields: STANDARD_OBJECT_FIELDS.task,
        viewFieldNames: [
          'dueAt',
          'status',
          'assignee',
          'taskTargets',
          'attachments',
          'timelineActivities',
        ],
        viewFieldGroupNames: {
          general: 'General',
        },
      }),
    },
  },
  taskTarget: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
    fields: STANDARD_OBJECT_FIELDS.taskTarget,
    morphIds: {
      targetMorphId: { morphId: '20202020-f636-435d-ab8d-e1168b375c71' },
    },
    indexes: {
      taskIdIndex: {
        universalIdentifier: 'c882f7a4-b025-4d32-aa26-5ef2595bdbf9',
      },
      personIdIndex: {
        universalIdentifier: 'b7d305d1-6fae-4ed6-9bdc-354fe9032c0e',
      },
      companyIdIndex: {
        universalIdentifier: 'c0af54c7-751b-4bb2-b102-677cc4e47402',
      },
      opportunityIdIndex: {
        universalIdentifier: '6942e0ba-90f6-4c33-bf40-7f00b1ec35ab',
      },
      taskPersonUniqueIndex: {
        universalIdentifier: '4adf4d5a-ad69-4c5c-bc62-2807816b3aa8',
      },
      taskCompanyUniqueIndex: {
        universalIdentifier: '637dce5e-f609-49f4-89e3-c0ef9e330d3a',
      },
      taskOpportunityUniqueIndex: {
        universalIdentifier: 'eb5422ff-7a41-48d2-a2df-3de1cbf7bced',
      },
    },
    views: {
      allTaskTargets: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.taskTarget,
        fields: STANDARD_OBJECT_FIELDS.taskTarget,
        viewFieldNames: [
          'id',
          'task',
          'targetPerson',
          'targetCompany',
          'targetOpportunity',
        ],
      }),
    },
  },
  timelineActivity: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
    fields: STANDARD_OBJECT_FIELDS.timelineActivity,
    morphIds: {
      targetMorphId: { morphId: '20202020-9a2b-4c3d-a4e5-f6a7b8c9d0e1' },
    },
    indexes: {
      workspaceMemberIdIndex: {
        universalIdentifier: '5e0b2391-85ca-4a66-aef4-52d74245bec2',
      },
      personIdIndex: {
        universalIdentifier: '3e89a914-7bec-47bd-9cf9-743c6b83d001',
      },
      companyIdIndex: {
        universalIdentifier: '8183e8f2-9114-4d6a-8e5f-12c3d14c5c13',
      },
      opportunityIdIndex: {
        universalIdentifier: '9294f9a3-0225-4e7b-9f6a-23d4e25d6d24',
      },
      noteIdIndex: {
        universalIdentifier: '995db1d8-0d3e-40f7-b0eb-5e6897bc9966',
      },
      taskIdIndex: {
        universalIdentifier: '609cf622-86ef-48d1-812b-e1cab610a46c',
      },
      workflowIdIndex: {
        universalIdentifier: 'd6059ec2-92b0-4cfc-9fd8-78050f03108f',
      },
      workflowVersionIdIndex: {
        universalIdentifier: 'd94329b3-5dc8-4141-ae28-31afe28f7135',
      },
      workflowRunIdIndex: {
        universalIdentifier: '1a2bd046-7c23-4e0a-9f8a-c3ca3a16d3b9',
      },
      dashboardIdIndex: {
        universalIdentifier: 'e8821da9-728d-470a-bf5b-5a981fff7880',
      },
    },
    views: {
      allTimelineActivities: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.timelineActivity,
        fields: STANDARD_OBJECT_FIELDS.timelineActivity,
        viewFieldNames: [
          'linkedRecordCachedName',
          'happensAt',
          'workspaceMember',
          'targetPerson',
          'targetCompany',
          'targetOpportunity',
          'targetTask',
          'targetNote',
          'targetWorkflow',
          'targetWorkflowVersion',
          'targetWorkflowRun',
          'targetDashboard',
        ],
      }),
    },
  },
  workflow: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflow,
    fields: STANDARD_OBJECT_FIELDS.workflow,
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: 'c7e64c55-eb0c-4b93-b076-5cfcf2e2e042',
      },
    },
    views: {
      allWorkflows: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflow,
        fields: STANDARD_OBJECT_FIELDS.workflow,
        viewFieldNames: [
          'name',
          'statuses',
          'updatedAt',
          'createdBy',
          'versions',
          'runs',
        ],
      }),
    },
  },
  workflowAutomatedTrigger: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowAutomatedTrigger,
    fields: STANDARD_OBJECT_FIELDS.workflowAutomatedTrigger,
    indexes: {
      workflowIdIndex: {
        universalIdentifier: '7331ff89-a3f9-4ac0-9fa9-0de5663ae7b2',
      },
    },
    views: {
      allWorkflowAutomatedTriggers: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowAutomatedTrigger,
        fields: STANDARD_OBJECT_FIELDS.workflowAutomatedTrigger,
        viewFieldNames: ['type', 'workflow', 'createdAt'],
      }),
      workflowAutomatedTriggerRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowAutomatedTrigger,
          fields: STANDARD_OBJECT_FIELDS.workflowAutomatedTrigger,
          viewFieldNames: ['type', 'workflow', 'createdAt', 'createdBy'],
          viewFieldGroupNames: {
            general: 'General',
            system: 'System',
          },
        }),
    },
  },
  workflowRun: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowRun,
    fields: STANDARD_OBJECT_FIELDS.workflowRun,
    indexes: {
      workflowVersionIdIndex: {
        universalIdentifier: '8183c8d2-9114-4b6e-8c5d-12a3b14a5a14',
      },
      workflowIdIndex: {
        universalIdentifier: '9294d9e3-0225-4c7f-9d6e-23b4c25b6b25',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'e0ac5ad2-d0c8-4f72-b710-8e53b9dc18d9',
      },
    },
    views: {
      allWorkflowRuns: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowRun,
        fields: STANDARD_OBJECT_FIELDS.workflowRun,
        viewFieldNames: ['name', 'workflow', 'status'],
      }),
      workflowRunRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowRun,
        fields: STANDARD_OBJECT_FIELDS.workflowRun,
        viewFieldNames: [
          'status',
          'workflow',
          'workflowVersion',
          'startedAt',
          'endedAt',
          'createdAt',
          'createdBy',
          'enqueuedAt',
          'state',
          'updatedAt',
          'updatedBy',
          'timelineActivities',
        ],
        viewFieldGroupNames: {
          general: 'General',
          system: 'System',
        },
      }),
    },
  },
  workflowVersion: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowVersion,
    fields: STANDARD_OBJECT_FIELDS.workflowVersion,
    indexes: {
      workflowIdIndex: {
        universalIdentifier: '8138c3b3-0b14-4ee1-be0e-debdde6b3219',
      },
      searchVectorGinIndex: {
        universalIdentifier: '6f3a65eb-2aee-4108-b8a0-c62da419d1dc',
      },
    },
    views: {
      allWorkflowVersions: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowVersion,
        fields: STANDARD_OBJECT_FIELDS.workflowVersion,
        viewFieldNames: ['name', 'workflow', 'status', 'updatedAt', 'runs'],
      }),
      workflowVersionRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workflowVersion,
        fields: STANDARD_OBJECT_FIELDS.workflowVersion,
        viewFieldNames: [
          'status',
          'workflow',
          'trigger',
          'createdAt',
          'steps',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'runs',
          'timelineActivities',
        ],
        viewFieldGroupNames: {
          general: 'General',
          system: 'System',
        },
      }),
    },
  },
  workspaceMember: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
    fields: STANDARD_OBJECT_FIELDS.workspaceMember,
    indexes: {
      userEmailUniqueIndex: {
        universalIdentifier: '76da5f27-523c-44b6-ad06-12954f6b949f',
      },
      searchVectorGinIndex: {
        universalIdentifier: '8678dde9-a804-4a9e-80e3-9af35e471ec5',
      },
    },
    views: {
      allWorkspaceMembers: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember,
        fields: STANDARD_OBJECT_FIELDS.workspaceMember,
        viewFieldNames: [
          'name',
          'createdAt',
          'ownedOpportunities',
          'assignedTasks',
        ],
      }),
    },
  },
  // Achare recruitment domain objects (stable — never mutate a universal identifier)
  requirement: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
    fields: STANDARD_OBJECT_FIELDS.requirement,
    indexes: {
      companyIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.reqCompanyIdIndex,
      },
      dealIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.reqDealIdIndex,
      },
      pointOfContactIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.reqPointOfContactIdIndex,
      },
      bdeOwnerIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.reqBdeOwnerIdIndex,
      },
      hrOwnerIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.reqHrOwnerIdIndex,
      },
      recruiterOwnerIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.reqRecruiterOwnerIdIndex,
      },
      statusIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.reqStatusIndex,
      },
      searchVectorGinIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.reqSearchVectorGinIndex,
      },
    },
    views: {
      allRequirements: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
        fields: STANDARD_OBJECT_FIELDS.requirement,
        viewFieldNames: [
          'title',
          'company',
          'status',
          'priority',
          'bdeOwner',
          'hrOwner',
          'numberOfOpenings',
          'filledCount',
          'targetDate',
          'createdBy',
        ],
      }),
      byStatus: {
        universalIdentifier: ACHARE_STD_UUIDS.reqByStatusView,
        viewFields: {
          title: {
            universalIdentifier: ACHARE_STD_UUIDS.reqBoardVfTitle,
          },
          company: {
            universalIdentifier: ACHARE_STD_UUIDS.reqBoardVfCompany,
          },
          status: {
            universalIdentifier: ACHARE_STD_UUIDS.reqBoardVfStatus,
          },
          priority: {
            universalIdentifier: ACHARE_STD_UUIDS.reqBoardVfPriority,
          },
          numberOfOpenings: {
            universalIdentifier: ACHARE_STD_UUIDS.reqBoardVfOpenings,
          },
          filledCount: {
            universalIdentifier: ACHARE_STD_UUIDS.reqBoardVfFilled,
          },
          targetDate: {
            universalIdentifier: ACHARE_STD_UUIDS.reqBoardVfTargetDate,
          },
        },
        viewGroups: {
          draft: { universalIdentifier: 'da6ea4f4-a281-4eba-9c22-2465edf71821' },
          received: {
            universalIdentifier: '8d7ad651-790c-48a5-b177-dff9224e158c',
          },
          confirmed: {
            universalIdentifier: 'e6a6948f-596b-4179-bbed-1108f7a60e0c',
          },
          commercialAgreed: {
            universalIdentifier: '9d4824ff-d425-4fa2-b386-a7a8ffa93025',
          },
          assignedToHr: {
            universalIdentifier: '77d73704-062c-413a-b720-e653351c8a80',
          },
          inProgress: {
            universalIdentifier: '79ec4549-a230-4e13-82c3-0792d257bdf4',
          },
          partiallyFilled: {
            universalIdentifier: '68a5705a-f40d-4d36-8d9f-2e6887106a62',
          },
          filled: {
            universalIdentifier: '2a6f47ab-9dd0-4e49-b685-d3835ed15c3c',
          },
          closed: {
            universalIdentifier: '885d015e-2247-453d-aae7-625ec9fe8546',
          },
          cancelled: {
            universalIdentifier: '0cec8d50-613d-44e2-933e-ae5189eff058',
          },
        },
      },
      requirementRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.requirement,
        fields: STANDARD_OBJECT_FIELDS.requirement,
        viewFieldNames: [
          'title',
          'rolePosition',
          'company',
          'pointOfContact',
          'deal',
          'location',
          'workMode',
          'employmentType',
          'experienceMin',
          'experienceMax',
          'salaryMin',
          'salaryMax',
          'skills',
          'education',
          'description',
          'responsibilities',
          'requirementsText',
          'priority',
          'status',
          'numberOfOpenings',
          'filledCount',
          'bdeOwner',
          'hrOwner',
          'recruiterOwner',
          'receivedAt',
          'targetDate',
          'closedAt',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'taskTargets',
          'noteTargets',
          'attachments',
          'timelineActivities',
          'candidateSubmissions',
          'interviews',
        ],
        viewFieldGroupNames: {
          recruitment: 'Recruitment',
          ownership: 'Ownership',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  candidate: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
    fields: STANDARD_OBJECT_FIELDS.candidate,
    indexes: {
      personIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.candPersonIdIndex,
      },
      recruiterOwnerIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.candRecruiterOwnerIdIndex,
      },
      statusIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.candStatusIndex,
      },
      sourceIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.candSourceIndex,
      },
      searchVectorGinIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.candSearchVectorGinIndex,
      },
    },
    views: {
      allCandidates: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
        fields: STANDARD_OBJECT_FIELDS.candidate,
        viewFieldNames: [
          'name',
          'person',
          'source',
          'recruiterOwner',
          'status',
          'totalExperienceYears',
          'expectedSalary',
          'noticePeriod',
          'createdBy',
        ],
      }),
      candidateRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidate,
        fields: STANDARD_OBJECT_FIELDS.candidate,
        viewFieldNames: [
          'name',
          'person',
          'source',
          'skills',
          'totalExperienceYears',
          'currentCompany',
          'currentDesignation',
          'currentSalary',
          'expectedSalary',
          'noticePeriod',
          'preferredLocation',
          'recruiterOwner',
          'status',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'taskTargets',
          'noteTargets',
          'attachments',
          'timelineActivities',
          'candidateSubmissions',
          'interviews',
          'placements',
        ],
        viewFieldGroupNames: {
          candidate: 'Candidate',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  candidateSubmission: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
    fields: STANDARD_OBJECT_FIELDS.candidateSubmission,
    indexes: {
      candidateIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.subCandidateIdIndex,
      },
      requirementIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.subRequirementIdIndex,
      },
      recruiterIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.subRecruiterIdIndex,
      },
      hrOwnerIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.subHrOwnerIdIndex,
      },
      stageIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.subStageIndex,
      },
      candidateRequirementUniqueIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.subCandidateRequirementUniqueIndex,
      },
      searchVectorGinIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.subSearchVectorGinIndex,
      },
    },
    views: {
      allSubmissions: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
        fields: STANDARD_OBJECT_FIELDS.candidateSubmission,
        viewFieldNames: [
          'name',
          'candidate',
          'requirement',
          'stage',
          'recruiter',
          'expectedSalary',
          'joiningDate',
          'createdBy',
        ],
      }),
      byStage: {
        universalIdentifier: ACHARE_STD_UUIDS.subByStageView,
        viewFields: {
          name: {
            universalIdentifier: ACHARE_STD_UUIDS.subPipelineVfName,
          },
          candidate: {
            universalIdentifier: ACHARE_STD_UUIDS.subPipelineVfCandidate,
          },
          stage: {
            universalIdentifier: ACHARE_STD_UUIDS.subPipelineVfStage,
          },
          recruiter: {
            universalIdentifier: ACHARE_STD_UUIDS.subPipelineVfRecruiter,
          },
          expectedSalary: {
            universalIdentifier: ACHARE_STD_UUIDS.subPipelineVfExpectedSalary,
          },
          joiningDate: {
            universalIdentifier: ACHARE_STD_UUIDS.subPipelineVfJoiningDate,
          },
        },
        viewGroups: {
          sourced: {
            universalIdentifier: '9eb09df1-111c-4500-b9c5-71eb9374d338',
          },
          screening: {
            universalIdentifier: '9d9f337b-10ce-4732-abbe-0d7cc9143d79',
          },
          shortlisted: {
            universalIdentifier: 'f0a0148e-9c1b-4a48-a7e2-63f9e0ca27fb',
          },
          submittedToClient: {
            universalIdentifier: 'aaf8fc25-e89a-40ee-befd-232fd8daa200',
          },
          clientReview: {
            universalIdentifier: '4a26ed00-4e35-41e9-882a-641cb18a85d9',
          },
          interview: {
            universalIdentifier: '6b8656b1-163c-46d1-ba18-59db8bd69ed7',
          },
          selected: {
            universalIdentifier: '0f01db9c-7109-40d3-9f82-4fc84a06f62a',
          },
          offer: {
            universalIdentifier: '88e8b4ae-881f-487f-a751-3d040d7733f6',
          },
          offerAccepted: {
            universalIdentifier: '749b0969-9c10-4a5c-9efe-f83d68d8e401',
          },
          joined: {
            universalIdentifier: 'd997f7bf-0323-4ba0-9e4a-c4b52549b235',
          },
          rejected: {
            universalIdentifier: '757b7f44-8dab-4236-9f2f-86d4cfffb1a8',
          },
          dropped: {
            universalIdentifier: '227bf223-dddd-4495-9250-e5159e46ce65',
          },
        },
      },
      candidateSubmissionRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.candidateSubmission,
          fields: STANDARD_OBJECT_FIELDS.candidateSubmission,
          viewFieldNames: [
            'name',
            'candidate',
            'requirement',
            'recruiter',
            'hrOwner',
            'stage',
            'resumeSent',
            'clientFeedback',
            'expectedSalary',
            'offeredSalary',
            'joiningDate',
            'rejectionReason',
            'dropReason',
            'createdAt',
            'createdBy',
            'updatedAt',
            'updatedBy',
            'taskTargets',
            'noteTargets',
            'attachments',
            'timelineActivities',
            'interviews',
            'applicationStageHistories',
            'placements',
          ],
          viewFieldGroupNames: {
            submission: 'Submission',
            relations: 'Relations',
            system: 'System',
          },
        }),
    },
  },
  interview: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
    fields: STANDARD_OBJECT_FIELDS.interview,
    indexes: {
      submissionIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.intSubmissionIdIndex,
      },
      requirementIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.intRequirementIdIndex,
      },
      candidateIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.intCandidateIdIndex,
      },
      companyIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.intCompanyIdIndex,
      },
      scheduledAtIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.intScheduledAtIndex,
      },
      statusIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.intStatusIndex,
      },
      searchVectorGinIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.intSearchVectorGinIndex,
      },
    },
    views: {
      allInterviews: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
        fields: STANDARD_OBJECT_FIELDS.interview,
        viewFieldNames: [
          'title',
          'candidate',
          'requirement',
          'round',
          'interviewer',
          'scheduledAt',
          'mode',
          'status',
          'result',
          'createdBy',
        ],
      }),
      byScheduledAt: {
        universalIdentifier: ACHARE_STD_UUIDS.intCalendarView,
        viewFields: {
          title: {
            universalIdentifier: ACHARE_STD_UUIDS.intCalendarVfTitle,
          },
          candidate: {
            universalIdentifier: ACHARE_STD_UUIDS.intCalendarVfCandidate,
          },
          scheduledAt: {
            universalIdentifier: ACHARE_STD_UUIDS.intCalendarVfScheduledAt,
          },
          mode: {
            universalIdentifier: ACHARE_STD_UUIDS.intCalendarVfMode,
          },
        },
      },
      interviewRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interview,
        fields: STANDARD_OBJECT_FIELDS.interview,
        viewFieldNames: [
          'title',
          'submission',
          'requirement',
          'candidate',
          'company',
          'round',
          'interviewer',
          'scheduledAt',
          'mode',
          'meetingLink',
          'status',
          'result',
          'feedback',
          'interviewParticipants',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'taskTargets',
          'noteTargets',
          'attachments',
          'timelineActivities',
        ],
        viewFieldGroupNames: {
          interview: 'Interview',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  designation: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.designation,
    fields: STANDARD_OBJECT_FIELDS.designation,
    indexes: {
      titleIndex: {
        universalIdentifier: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
      },
      statusIndex: {
        universalIdentifier: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
      },
    },
    views: {
      allDesignations: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.designation,
        fields: STANDARD_OBJECT_FIELDS.designation,
        viewFieldNames: [
          'title',
          'level',
          'status',
          'description',
          'createdAt',
        ],
      }),
    },
  },
  employee: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
    fields: STANDARD_OBJECT_FIELDS.employee,
    indexes: {
      employeeCodeUniqueIndex: {
        universalIdentifier: 'ff0d3e00-c77b-4193-8912-5293c6bf0b0a',
      },
      personIdIndex: {
        universalIdentifier: 'db5ee3ee-8a79-403a-81d2-dc8c4456344e',
      },
      statusIndex: {
        universalIdentifier: '80ab60fd-e5fb-41a3-8e2b-25d8c8f1494a',
      },
      searchVectorGinIndex: {
        universalIdentifier: '99d916a4-e8ee-42b2-8d28-65810da35ef3',
      },
    },
    views: {
      allEmployees: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        fields: STANDARD_OBJECT_FIELDS.employee,
        viewFieldNames: [
          'employeeCode',
          'person',
          'status',
          'department',
          'designation',
          'employmentType',
          'joiningDate',
          'workLocation',
          'createdBy',
        ],
      }),
      employeeRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.employee,
        fields: STANDARD_OBJECT_FIELDS.employee,
        viewFieldNames: [
          'employeeCode',
          'person',
          'status',
          'department',
          'designation',
          'employmentType',
          'joiningDate',
          'exitDate',
          'workLocation',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'onboardingItems',
          'rosterAssignments',
          'attendanceDays',
          'attendanceEvents',
          'attendanceCorrections',
          'leaveRequests',
          'leaveBalances',
          'salaryStructures',
          'payslips',
          'payrollAdjustments',
          'taskTargets',
          'noteTargets',
          'attachments',
          'timelineActivities',
        ],
        viewFieldGroupNames: {
          employee: 'Employee',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  placement: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.placement,
    fields: STANDARD_OBJECT_FIELDS.placement,
    indexes: {
      submissionIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.plcSubmissionIdIndex,
      },
      candidateIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.plcCandidateIdIndex,
      },
      statusIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.plcStatusIndex,
      },
      searchVectorGinIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.plcSearchVectorGinIndex,
      },
    },
    views: {
      allPlacements: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.placement,
        fields: STANDARD_OBJECT_FIELDS.placement,
        viewFieldNames: [
          'candidate',
          'submission',
          'placementDate',
          'joiningDate',
          'placementFee',
          'feeStatus',
          'status',
          'createdAt',
        ],
      }),
      placementRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.placement,
        fields: STANDARD_OBJECT_FIELDS.placement,
        viewFieldNames: [
          'candidate',
          'submission',
          'placementDate',
          'joiningDate',
          'replacementDueDate',
          'placementFee',
          'salary',
          'feeStatus',
          'status',
          'notes',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
        ],
        viewFieldGroupNames: {
          placement: 'Placement',
          commercial: 'Commercial',
          system: 'System',
        },
      }),
    },
  },
  interviewParticipant: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interviewParticipant,
    fields: STANDARD_OBJECT_FIELDS.interviewParticipant,
    indexes: {
      interviewIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.ivpInterviewIdIndex,
      },
      personIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.ivpPersonIdIndex,
      },
      searchVectorGinIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.ivpSearchVectorGinIndex,
      },
    },
    views: {
      allInterviewParticipants: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interviewParticipant,
        fields: STANDARD_OBJECT_FIELDS.interviewParticipant,
        viewFieldNames: [
          'person',
          'interview',
          'role',
          'response',
          'createdAt',
        ],
      }),
      interviewParticipantRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.interviewParticipant,
          fields: STANDARD_OBJECT_FIELDS.interviewParticipant,
          viewFieldNames: [
            'person',
            'interview',
            'role',
            'response',
            'feedback',
            'createdAt',
            'createdBy',
            'updatedAt',
            'updatedBy',
          ],
          viewFieldGroupNames: {
            participant: 'Participant',
            system: 'System',
          },
        }),
    },
  },
  personExternalId: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.personExternalId,
    fields: STANDARD_OBJECT_FIELDS.personExternalId,
    indexes: {
      personIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.pexPersonIdIndex,
      },
      sourceIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.pexSourceIndex,
      },
      searchVectorGinIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.pexSearchVectorGinIndex,
      },
    },
    views: {
      allPersonExternalIds: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.personExternalId,
        fields: STANDARD_OBJECT_FIELDS.personExternalId,
        viewFieldNames: [
          'person',
          'source',
          'externalId',
          'externalUrl',
          'syncedAt',
        ],
      }),
      personExternalIdRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.personExternalId,
          fields: STANDARD_OBJECT_FIELDS.personExternalId,
          viewFieldNames: [
            'person',
            'source',
            'externalId',
            'externalUrl',
            'syncedAt',
            'createdAt',
            'createdBy',
            'updatedAt',
            'updatedBy',
          ],
          viewFieldGroupNames: {
            external: 'External',
            system: 'System',
          },
        }),
    },
  },
  applicationStageHistory: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.applicationStageHistory,
    fields: STANDARD_OBJECT_FIELDS.applicationStageHistory,
    indexes: {
      submissionIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.ashSubmissionIdIndex,
      },
      changedByIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.ashChangedByIdIndex,
      },
      toStageIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.ashToStageIndex,
      },
      searchVectorGinIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.ashSearchVectorGinIndex,
      },
    },
    views: {
      allApplicationStageHistories: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.applicationStageHistory,
        fields: STANDARD_OBJECT_FIELDS.applicationStageHistory,
        viewFieldNames: [
          'submission',
          'fromStage',
          'toStage',
          'changedBy',
          'changedAt',
          'reason',
        ],
      }),
      applicationStageHistoryRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.applicationStageHistory,
          fields: STANDARD_OBJECT_FIELDS.applicationStageHistory,
          viewFieldNames: [
            'submission',
            'fromStage',
            'toStage',
            'changedBy',
            'changedAt',
            'reason',
            'createdAt',
            'createdBy',
            'updatedAt',
            'updatedBy',
          ],
          viewFieldGroupNames: {
            overview: 'Overview',
            system: 'System',
          },
        }),
    },
  },
  companyPersonRelationship: {
    universalIdentifier:
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.companyPersonRelationship,
    fields: STANDARD_OBJECT_FIELDS.companyPersonRelationship,
    indexes: {
      companyIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.cprCompanyIdIndex,
      },
      personIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.cprPersonIdIndex,
      },
      relationshipOwnerIdIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.cprRelationshipOwnerIdIndex,
      },
      statusIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.cprStatusIndex,
      },
      searchVectorGinIndex: {
        universalIdentifier: ACHARE_STD_UUIDS.cprSearchVectorGinIndex,
      },
    },
    views: {
      allCompanyPersonRelationships: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.companyPersonRelationship,
        fields: STANDARD_OBJECT_FIELDS.companyPersonRelationship,
        viewFieldNames: [
          'person',
          'company',
          'jobTitle',
          'relationshipType',
          'isPrimary',
          'relationshipOwner',
          'status',
          'createdAt',
        ],
      }),
      companyPersonRelationshipRecordPageFields:
        buildStandardObjectRecordPageFieldsView({
          objectUniversalIdentifier:
            STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.companyPersonRelationship,
          fields: STANDARD_OBJECT_FIELDS.companyPersonRelationship,
          viewFieldNames: [
            'person',
            'company',
            'jobTitle',
            'department',
            'relationshipType',
            'isPrimary',
            'relationshipOwner',
            'status',
            'createdAt',
            'createdBy',
            'updatedAt',
            'updatedBy',
          ],
          viewFieldGroupNames: {
            overview: 'Overview',
            system: 'System',
          },
        }),
    },
  },
  team: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
    fields: STANDARD_OBJECT_FIELDS.team,
    indexes: {},
    views: {
      allTeams: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.team,
        fields: STANDARD_OBJECT_FIELDS.team,
        viewFieldNames: [
          'name',
          'description',
          'status',
          'members',
          'createdAt',
        ],
      }),
    },
  },
  onboardingItem: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.onboardingItem,
    fields: STANDARD_OBJECT_FIELDS.onboardingItem,
    indexes: {
      employeeTitleUniqueIndex: {
        universalIdentifier: '26240034-7187-4d5e-83cc-d4d2bae58c77',
      },
      employeeIdIndex: {
        universalIdentifier: 'a25de2ed-ebb6-4826-8c26-89d45ba26379',
      },
      statusIndex: {
        universalIdentifier: 'b02eb08c-27a2-4ba0-8098-b303e544d528',
      },
    },
    views: {
      allOnboardingItems: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.onboardingItem,
        fields: STANDARD_OBJECT_FIELDS.onboardingItem,
        viewFieldNames: [
          'title',
          'employee',
          'assignedTo',
          'category',
          'isRequired',
          'dueDate',
          'status',
          'completedAt',
        ],
      }),
    },
  },
  shift: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.shift,
    fields: STANDARD_OBJECT_FIELDS.shift,
    indexes: {
      nameIndex: {
        universalIdentifier: 'cd32ad37-d31b-4c3a-8af6-e40541bf9664',
      },
      searchVectorGinIndex: {
        universalIdentifier: '42f5bf7a-b5a3-4a09-8afa-6346e1330ca1',
      },
    },
    views: {
      allShifts: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.shift,
        fields: STANDARD_OBJECT_FIELDS.shift,
        viewFieldNames: [
          'name',
          'startTime',
          'endTime',
          'breakMinutes',
          'graceMinutes',
          'workingDays',
          'isActive',
        ],
      }),
      shiftRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.shift,
        fields: STANDARD_OBJECT_FIELDS.shift,
        viewFieldNames: [
          'name',
          'startTime',
          'endTime',
          'breakMinutes',
          'graceMinutes',
          'workingDays',
          'isActive',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'rosterAssignments',
        ],
        viewFieldGroupNames: {
          shift: 'Shift',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  rosterAssignment: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.rosterAssignment,
    fields: STANDARD_OBJECT_FIELDS.rosterAssignment,
    indexes: {
      employeeIdIndex: {
        universalIdentifier: 'cad75f01-5807-4c4f-85b9-4308ba5fb2ed',
      },
      shiftIdIndex: {
        universalIdentifier: 'c7868182-9965-40c1-8946-30f6c3d4859a',
      },
      effectiveFromIndex: {
        universalIdentifier: '708568e2-3724-48cf-8685-f098df57e5fe',
      },
    },
    views: {
      allRosterAssignments: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.rosterAssignment,
        fields: STANDARD_OBJECT_FIELDS.rosterAssignment,
        viewFieldNames: [
          'id',
          'employee',
          'shift',
          'effectiveFrom',
          'effectiveTo',
          'isActive',
        ],
      }),
    },
  },
  attendanceEvent: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceEvent,
    fields: STANDARD_OBJECT_FIELDS.attendanceEvent,
    indexes: {
      employeeTimestampIndex: {
        universalIdentifier: '679ffa56-8228-44a3-835d-d53fac96880d',
      },
      eventTypeIndex: {
        universalIdentifier: 'b1394db6-98a5-4c0e-832c-06b564c40a63',
      },
    },
    views: {
      allAttendanceEvents: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceEvent,
        fields: STANDARD_OBJECT_FIELDS.attendanceEvent,
        viewFieldNames: [
          'id',
          'employee',
          'timestamp',
          'eventType',
          'source',
          'correction',
        ],
      }),
    },
  },
  attendanceDay: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceDay,
    fields: STANDARD_OBJECT_FIELDS.attendanceDay,
    indexes: {
      employeeWorkDateUniqueIndex: {
        universalIdentifier: '8b335da8-a866-427b-872e-034520204c39',
      },
      statusIndex: {
        universalIdentifier: '0b910f05-f48a-4516-8ff0-112162b1fbed',
      },
      workDateIndex: {
        universalIdentifier: '121ce378-a5ff-46af-8365-8b570a2e4f8d',
      },
    },
    views: {
      allAttendanceDays: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceDay,
        fields: STANDARD_OBJECT_FIELDS.attendanceDay,
        viewFieldNames: [
          'id',
          'employee',
          'workDate',
          'shift',
          'status',
          'firstCheckIn',
          'lastCheckOut',
          'workedMinutes',
          'lateMinutes',
          'overtimeMinutes',
        ],
      }),
      attendanceDayRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceDay,
        fields: STANDARD_OBJECT_FIELDS.attendanceDay,
        viewFieldNames: [
          'employee',
          'workDate',
          'shift',
          'status',
          'firstCheckIn',
          'lastCheckOut',
          'workedMinutes',
          'breakMinutes',
          'lateMinutes',
          'earlyDepartureMinutes',
          'overtimeMinutes',
          'createdAt',
          'updatedAt',
        ],
        viewFieldGroupNames: {
          attendance: 'Attendance',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  attendanceCorrection: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceCorrection,
    fields: STANDARD_OBJECT_FIELDS.attendanceCorrection,
    indexes: {
      employeeIdIndex: {
        universalIdentifier: '24c56bdd-5a95-4541-81b4-f74110f9aa39',
      },
      statusIndex: {
        universalIdentifier: 'ae76bf39-c137-4c0f-8935-51781f103719',
      },
      workDateIndex: {
        universalIdentifier: '4f31460c-d585-48a9-844c-ac055c87492d',
      },
    },
    views: {
      allAttendanceCorrections: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceCorrection,
        fields: STANDARD_OBJECT_FIELDS.attendanceCorrection,
        viewFieldNames: [
          'id',
          'employee',
          'workDate',
          'status',
          'reviewedBy',
          'requestedCheckIn',
          'requestedCheckOut',
          'reason',
        ],
      }),
      attendanceCorrectionRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attendanceCorrection,
        fields: STANDARD_OBJECT_FIELDS.attendanceCorrection,
        viewFieldNames: [
          'employee',
          'workDate',
          'requestedCheckIn',
          'requestedCheckOut',
          'reason',
          'status',
          'reviewedBy',
          'reviewedAt',
          'reviewNotes',
          'createdAt',
          'createdBy',
          'correctedEvents',
        ],
        viewFieldGroupNames: {
          correction: 'Correction',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  leaveType: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveType,
    fields: STANDARD_OBJECT_FIELDS.leaveType,
    indexes: {
      nameIndex: {
        universalIdentifier: '918068f0-a073-4ae9-89ad-001b0fbf321e',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'bc790012-38b8-46cc-8234-c61576ede210',
      },
    },
    views: {
      allLeaveTypes: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveType,
        fields: STANDARD_OBJECT_FIELDS.leaveType,
        viewFieldNames: [
          'name',
          'isPaid',
          'annualQuota',
          'isActive',
        ],
      }),
      leaveTypeRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveType,
        fields: STANDARD_OBJECT_FIELDS.leaveType,
        viewFieldNames: [
          'name',
          'isPaid',
          'annualQuota',
          'isActive',
          'createdAt',
          'createdBy',
          'leaveRequests',
          'leaveBalances',
        ],
        viewFieldGroupNames: {
          leave: 'Leave',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  leaveRequest: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveRequest,
    fields: STANDARD_OBJECT_FIELDS.leaveRequest,
    indexes: {
      employeeIdIndex: {
        universalIdentifier: 'bb6773e9-8943-450a-8183-97eea28069a0',
      },
      leaveTypeIdIndex: {
        universalIdentifier: '7eb97998-5f5c-4643-8a71-1661e484bbdd',
      },
      statusIndex: {
        universalIdentifier: 'ddfb406c-8895-4474-8684-cffc977fae28',
      },
    },
    views: {
      allLeaveRequests: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveRequest,
        fields: STANDARD_OBJECT_FIELDS.leaveRequest,
        viewFieldNames: [
          'id',
          'employee',
          'leaveType',
          'startDate',
          'endDate',
          'days',
          'status',
          'reviewedBy',
        ],
      }),
      leaveRequestRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveRequest,
        fields: STANDARD_OBJECT_FIELDS.leaveRequest,
        viewFieldNames: [
          'employee',
          'leaveType',
          'startDate',
          'endDate',
          'days',
          'reason',
          'status',
          'reviewedBy',
          'reviewedAt',
          'reviewNotes',
          'createdAt',
          'createdBy',
        ],
        viewFieldGroupNames: {
          leave: 'Leave',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  leaveBalance: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveBalance,
    fields: STANDARD_OBJECT_FIELDS.leaveBalance,
    indexes: {
      employeeTypeYearUniqueIndex: {
        universalIdentifier: '04f6011e-cd9b-486e-83d9-ceb13c6affb0',
      },
      employeeIdIndex: {
        universalIdentifier: '9b5d9789-a954-4f03-8eda-24e8c416bece',
      },
    },
    views: {
      allLeaveBalances: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.leaveBalance,
        fields: STANDARD_OBJECT_FIELDS.leaveBalance,
        viewFieldNames: [
          'id',
          'employee',
          'leaveType',
          'year',
          'entitled',
          'used',
          'pending',
        ],
      }),
    },
  },
  salaryStructure: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryStructure,
    fields: STANDARD_OBJECT_FIELDS.salaryStructure,
    indexes: {
      employeeIdIndex: {
        universalIdentifier: '7df48854-6a07-46c9-88fa-d445ddce20cf',
      },
      effectiveFromIndex: {
        universalIdentifier: 'b7c24ca9-7179-4249-894e-46e2a0d734dd',
      },
    },
    views: {
      allSalaryStructures: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryStructure,
        fields: STANDARD_OBJECT_FIELDS.salaryStructure,
        viewFieldNames: [
          'id',
          'employee',
          'effectiveFrom',
          'effectiveTo',
          'currency',
          'monthlyGross',
          'isActive',
        ],
      }),
      salaryStructureRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryStructure,
        fields: STANDARD_OBJECT_FIELDS.salaryStructure,
        viewFieldNames: [
          'employee',
          'effectiveFrom',
          'effectiveTo',
          'currency',
          'monthlyGross',
          'isActive',
          'createdAt',
          'createdBy',
          'components',
        ],
        viewFieldGroupNames: {
          salary: 'Salary',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  salaryComponent: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryComponent,
    fields: STANDARD_OBJECT_FIELDS.salaryComponent,
    indexes: {
      structureNameUniqueIndex: {
        universalIdentifier: 'b6c5b963-8531-4593-8ba2-2e64e0c83f37',
      },
      structureIdIndex: {
        universalIdentifier: '41be4eea-032b-4169-80f1-fa58747aae06',
      },
    },
    views: {
      allSalaryComponents: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.salaryComponent,
        fields: STANDARD_OBJECT_FIELDS.salaryComponent,
        viewFieldNames: [
          'name',
          'salaryStructure',
          'componentType',
          'calculationType',
          'amount',
          'percentage',
          'position',
        ],
      }),
    },
  },
  payrollPeriod: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollPeriod,
    fields: STANDARD_OBJECT_FIELDS.payrollPeriod,
    indexes: {
      nameUniqueIndex: {
        universalIdentifier: 'e9b7eafe-dbe1-40bc-82f7-f2bf337b1662',
      },
      statusIndex: {
        universalIdentifier: '79b4c373-3c4a-4d2d-8130-bdc5a795faf6',
      },
      searchVectorGinIndex: {
        universalIdentifier: '5de4a94b-92be-43e4-8aeb-4ecd63cff94b',
      },
    },
    views: {
      allPayrollPeriods: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollPeriod,
        fields: STANDARD_OBJECT_FIELDS.payrollPeriod,
        viewFieldNames: [
          'name',
          'startDate',
          'endDate',
          'payDate',
          'status',
          'employeeCount',
          'totalGross',
          'totalNet',
        ],
      }),
      payrollPeriodRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollPeriod,
        fields: STANDARD_OBJECT_FIELDS.payrollPeriod,
        viewFieldNames: [
          'name',
          'startDate',
          'endDate',
          'payDate',
          'status',
          'employeeCount',
          'totalGross',
          'totalDeductions',
          'totalAdjustments',
          'totalNet',
          'createdAt',
          'createdBy',
          'payslips',
        ],
        viewFieldGroupNames: {
          payroll: 'Payroll',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  payslip: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslip,
    fields: STANDARD_OBJECT_FIELDS.payslip,
    indexes: {
      periodEmployeeUniqueIndex: {
        universalIdentifier: '80ed480c-df99-477b-86a8-0d5e6c4cc8ed',
      },
      employeeIdIndex: {
        universalIdentifier: '1f379d41-49a2-421f-8653-f0ae1c41e59b',
      },
      periodIdIndex: {
        universalIdentifier: 'fd7b563c-7275-43d9-8242-90c5ec1cacfc',
      },
    },
    views: {
      allPayslips: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslip,
        fields: STANDARD_OBJECT_FIELDS.payslip,
        viewFieldNames: [
          'id',
          'employee',
          'payrollPeriod',
          'grossEarnings',
          'totalDeductions',
          'totalAdjustments',
          'netPay',
          'paymentStatus',
        ],
      }),
      payslipRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslip,
        fields: STANDARD_OBJECT_FIELDS.payslip,
        viewFieldNames: [
          'payrollPeriod',
          'employee',
          'currency',
          'grossEarnings',
          'totalDeductions',
          'totalAdjustments',
          'netPay',
          'workingDays',
          'presentDays',
          'paidLeaveDays',
          'unpaidLeaveDays',
          'overtimeMinutes',
          'paymentStatus',
          'paidAt',
          'paymentReference',
          'paymentMethod',
          'createdAt',
          'lines',
        ],
        viewFieldGroupNames: {
          payslip: 'Payslip',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  payslipLine: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslipLine,
    fields: STANDARD_OBJECT_FIELDS.payslipLine,
    indexes: {
      payslipIdIndex: {
        universalIdentifier: '09b07235-15ca-4fbb-8413-7f0280fbf94c',
      },
    },
    views: {
      allPayslipLines: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payslipLine,
        fields: STANDARD_OBJECT_FIELDS.payslipLine,
        viewFieldNames: [
          'label',
          'payslip',
          'lineType',
          'amount',
          'notes',
        ],
      }),
    },
  },
  payrollAdjustment: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollAdjustment,
    fields: STANDARD_OBJECT_FIELDS.payrollAdjustment,
    indexes: {
      employeeIdIndex: {
        universalIdentifier: '6f7d4183-2a35-42b7-87b3-842790fabcb9',
      },
      periodIdIndex: {
        universalIdentifier: '105cfc79-7442-49c7-809e-661a15a33291',
      },
      statusIndex: {
        universalIdentifier: '185f9ab9-b9c9-4abc-83c4-43b72664cbe9',
      },
    },
    views: {
      allPayrollAdjustments: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollAdjustment,
        fields: STANDARD_OBJECT_FIELDS.payrollAdjustment,
        viewFieldNames: [
          'id',
          'employee',
          'payrollPeriod',
          'adjustmentType',
          'amount',
          'reason',
          'status',
        ],
      }),
      payrollAdjustmentRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payrollAdjustment,
        fields: STANDARD_OBJECT_FIELDS.payrollAdjustment,
        viewFieldNames: [
          'employee',
          'payrollPeriod',
          'adjustmentType',
          'amount',
          'reason',
          'status',
          'approvedBy',
          'approvedAt',
          'createdAt',
          'createdBy',
        ],
        viewFieldGroupNames: {
          adjustment: 'Adjustment',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  invoice: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
    fields: STANDARD_OBJECT_FIELDS.invoice,
    indexes: {
      invoiceNumberUniqueIndex: {
        universalIdentifier: '3f007db8-a9e0-4326-8422-ed3946d51c38',
      },
      companyIdIndex: {
        universalIdentifier: '5a6be31b-60e7-4562-8e67-02a5c9f93d2b',
      },
      requirementIdIndex: {
        universalIdentifier: 'd66fb8b1-87bc-4f56-8534-f5b70363b81c',
      },
      statusIndex: {
        universalIdentifier: '1b815766-5336-4779-8e0a-6d4a6fc8bd6d',
      },
      dueDateIndex: {
        universalIdentifier: '4b9524c8-e968-407b-8298-8b2569fd6e36',
      },
      searchVectorGinIndex: {
        universalIdentifier: '9bc523a8-970f-44ef-8919-e8b8dd7891f6',
      },
    },
    views: {
      allInvoices: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
        fields: STANDARD_OBJECT_FIELDS.invoice,
        viewFieldNames: [
          'invoiceNumber',
          'company',
          'amount',
          'invoiceDate',
          'dueDate',
          'status',
          'amountPaid',
          'outstanding',
        ],
      }),
      invoiceRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.invoice,
        fields: STANDARD_OBJECT_FIELDS.invoice,
        viewFieldNames: [
          'invoiceNumber',
          'company',
          'deal',
          'requirement',
          'amount',
          'invoiceDate',
          'dueDate',
          'status',
          'amountPaid',
          'outstanding',
          'notes',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'payments',
          'taskTargets',
          'noteTargets',
          'attachments',
          'timelineActivities',
        ],
        viewFieldGroupNames: {
          invoice: 'Invoice',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  payment: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payment,
    fields: STANDARD_OBJECT_FIELDS.payment,
    indexes: {
      invoiceIdIndex: {
        universalIdentifier: '02363e64-f828-441b-8024-d6fa088f22ee',
      },
    },
    views: {
      allPayments: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payment,
        fields: STANDARD_OBJECT_FIELDS.payment,
        viewFieldNames: [
          'id',
          'invoice',
          'amount',
          'paidDate',
          'method',
          'reference',
        ],
      }),
      paymentRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.payment,
        fields: STANDARD_OBJECT_FIELDS.payment,
        viewFieldNames: [
          'invoice',
          'amount',
          'paidDate',
          'method',
          'reference',
          'notes',
          'createdAt',
          'createdBy',
        ],
        viewFieldGroupNames: {
          payment: 'Payment',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  department: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.department,
    fields: STANDARD_OBJECT_FIELDS.department,
    indexes: {},
    views: {
      allDepartments: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.department,
        fields: STANDARD_OBJECT_FIELDS.department,
        viewFieldNames: [
          'name',
          'status',
          'departmentHead',
          'createdAt',
        ],
      }),
      departmentRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.department,
        fields: STANDARD_OBJECT_FIELDS.department,
        viewFieldNames: [
          'name',
          'description',
          'status',
          'departmentHead',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'employees',
        ],
        viewFieldGroupNames: {
          general: 'General',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
  location: {
    universalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
    fields: STANDARD_OBJECT_FIELDS.location,
    indexes: {
      statusIndex: {
        universalIdentifier: '3f2fcf24-1a6c-56cf-9f26-c645fe1c4a56',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'e89bc9dc-5114-52f8-b25a-3d28003f48b2',
      },
    },
    views: {
      allLocations: buildStandardObjectIndexView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
        fields: STANDARD_OBJECT_FIELDS.location,
        viewFieldNames: [
          'name',
          'city',
          'country',
          'status',
          'createdAt',
        ],
      }),
      locationRecordPageFields: buildStandardObjectRecordPageFieldsView({
        objectUniversalIdentifier:
          STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.location,
        fields: STANDARD_OBJECT_FIELDS.location,
        viewFieldNames: [
          'name',
          'address',
          'city',
          'state',
          'country',
          'timezone',
          'status',
          'createdAt',
          'createdBy',
          'updatedAt',
          'updatedBy',
          'employees',
          'taskTargets',
          'noteTargets',
          'attachments',
          'timelineActivities',
        ],
        viewFieldGroupNames: {
          general: 'General',
          relations: 'Relations',
          system: 'System',
        },
      }),
    },
  },
} as const satisfies Record<
  string,
  {
    universalIdentifier: string;
    morphIds?: Record<string, { morphId: string }>;
    fields: Record<string, { universalIdentifier: string }>;
    indexes: Record<string, { universalIdentifier: string }>;
    views?: Record<
      string,
      {
        universalIdentifier: string;
        viewFields: Record<string, { universalIdentifier: string }>;
        viewFieldGroups?: Record<string, { universalIdentifier: string }>;
        viewFilters?: Record<string, { universalIdentifier: string }>;
        viewGroups?: Record<string, { universalIdentifier: string }>;
      }
    >;
  }
>;
