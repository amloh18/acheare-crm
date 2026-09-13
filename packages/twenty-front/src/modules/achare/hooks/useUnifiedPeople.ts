import { useState, useEffect, useCallback, useMemo } from 'react';
import { UnifiedPerson, PersonContext, OrganizationRole, EmploymentData } from '../types/acharePeople';
import { INITIAL_ACHARE_PEOPLE } from '../data/acharePeopleData';

const PEOPLE_STORAGE_KEY = 'achare_unified_people_records';
const PEOPLE_UPDATE_EVENT = 'achare_people_updated';

export const useUnifiedPeople = () => {
  const [people, setPeopleState] = useState<UnifiedPerson[]>(() => {
    try {
      const stored = localStorage.getItem(PEOPLE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_ACHARE_PEOPLE;
  });

  // Keep in sync across windows and components
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === PEOPLE_STORAGE_KEY && e.newValue) {
        try {
          setPeopleState(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    const handleCustom = () => {
      try {
        const stored = localStorage.getItem(PEOPLE_STORAGE_KEY);
        if (stored) {
          setPeopleState(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(PEOPLE_UPDATE_EVENT, handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(PEOPLE_UPDATE_EVENT, handleCustom);
    };
  }, []);

  const savePeople = useCallback((updater: (prev: UnifiedPerson[]) => UnifiedPerson[]) => {
    setPeopleState((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(PEOPLE_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent(PEOPLE_UPDATE_EVENT));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Real-time Duplicate Detection
  const findDuplicates = useCallback(
    (name: string, email: string, phone: string, excludeId?: string) => {
      const normEmail = email.trim().toLowerCase();
      const normPhone = phone.replace(/[^0-9]/g, '');
      const normName = name.trim().toLowerCase();

      return people.filter((p) => {
        if (excludeId && p.id === excludeId) return false;
        const pEmail = p.email.trim().toLowerCase();
        const pPhone = p.phone.replace(/[^0-9]/g, '');
        const pName = p.name.trim().toLowerCase();

        const emailMatch = normEmail.length > 3 && pEmail === normEmail;
        const phoneMatch = normPhone.length > 6 && pPhone === normPhone;
        const nameMatch = normName.length > 2 && pName === normName;

        return emailMatch || phoneMatch || nameMatch;
      });
    },
    [people],
  );

  // Add a new Person
  const addPerson = useCallback(
    (newPerson: Omit<UnifiedPerson, 'id' | 'createdAt'>) => {
      const id = `p-${Date.now()}`;
      const person: UnifiedPerson = {
        ...newPerson,
        id,
        createdAt: new Date().toISOString(),
      };
      savePeople((prev) => [person, ...prev]);
      return person;
    },
    [savePeople],
  );

  // Update a Person
  const updatePerson = useCallback(
    (personId: string, patch: Partial<UnifiedPerson>) => {
      savePeople((prev) =>
        prev.map((p) => (p.id === personId ? { ...p, ...patch } : p)),
      );
    },
    [savePeople],
  );

  // Attach a new context or role to an existing person (avoids duplicate identities!)
  const attachContextToPerson = useCallback(
    (personId: string, newContext: PersonContext, newRole?: OrganizationRole) => {
      savePeople((prev) =>
        prev.map((p) => {
          if (p.id !== personId) return p;
          const nextContexts = p.contexts.includes(newContext)
            ? p.contexts
            : [...p.contexts, newContext];
          const nextRoles =
            newRole && !p.roles.includes(newRole)
              ? [...p.roles, newRole]
              : p.roles;
          const inHouse = nextContexts.includes('IN_HOUSE');

          return {
            ...p,
            contexts: nextContexts,
            roles: nextRoles,
            inHouse,
          };
        }),
      );
    },
    [savePeople],
  );

  // MANDATORY LIFECYCLE TRANSITION: Convert Candidate -> Employee
  // Preserves EXACT same Person ID, application trail, and documents!
  const convertCandidateToEmployee = useCallback(
    (personId: string, employmentDetails: Omit<EmploymentData, 'id'>) => {
      savePeople((prev) =>
        prev.map((p) => {
          if (p.id !== personId) return p;

          // 1. Add IN_HOUSE context and EMPLOYEE role
          const contexts: PersonContext[] = p.contexts.includes('IN_HOUSE')
            ? p.contexts
            : ['IN_HOUSE', ...p.contexts];
          const roles: OrganizationRole[] = p.roles.includes('EMPLOYEE')
            ? p.roles
            : [...p.roles, 'EMPLOYEE'];

          // 2. Mark applications as HIRED
          const updatedCandidateProfile = p.candidateProfile
            ? {
                ...p.candidateProfile,
                applications: p.candidateProfile.applications.map((app) => ({
                  ...app,
                  stage: 'HIRED' as const,
                  notes: `${app.notes || ''} [Hired into ${employmentDetails.department} on ${employmentDetails.joiningDate}]`,
                })),
              }
            : undefined;

          // 3. Create Employment record linked to this Person
          const employment: EmploymentData = {
            ...employmentDetails,
            id: `emp-${Date.now()}`,
          };

          return {
            ...p,
            inHouse: true,
            contexts,
            roles,
            employment,
            candidateProfile: updatedCandidateProfile,
            headline: `${employmentDetails.designation} · ${employmentDetails.department}`,
          };
        }),
      );
    },
    [savePeople],
  );

  // Summary counts
  const counts = useMemo(() => {
    const total = people.length;
    const team = people.filter((p) => p.inHouse || p.contexts.includes('IN_HOUSE') || p.employment).length;
    const candidates = people.filter((p) => p.contexts.includes('CANDIDATE') || p.candidateProfile).length;
    const contacts = people.filter((p) => p.contexts.includes('CONTACT') || p.companyRelationship).length;
    const contractors = people.filter((p) => p.contexts.includes('CONTRACTOR')).length;
    return { total, team, candidates, contacts, contractors };
  }, [people]);

  return {
    people,
    counts,
    findDuplicates,
    addPerson,
    updatePerson,
    attachContextToPerson,
    convertCandidateToEmployee,
  };
};
