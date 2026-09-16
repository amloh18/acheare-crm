import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useMemo, useState } from 'react';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { PageCardHeader } from '@/ui/layout/page/components/PageCardHeader';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconBell,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconNotes,
} from 'twenty-ui/icon';
import { useMyWorkspaceData } from '@/hr/hooks/useMyWorkspaceData';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledSearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  padding: 0 ${themeCssVariables.spacing[4]};
`;

const StyledSearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  flex: 1;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};

  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: ${themeCssVariables.font.size.sm};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledAnnouncementList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: 0 ${themeCssVariables.spacing[4]};
`;

const StyledAnnouncementCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[4]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.border.color.medium};
  }
`;

const StyledAnnouncementHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledAnnouncementTitle = styled.h3`
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
`;

const StyledAnnouncementDate = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
  white-space: nowrap;
`;

const StyledAnnouncementBody = styled.p`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
  margin: 0;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const StyledAnnouncementMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  border-top: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledPaginationInfo = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledPaginationButtons = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledPageButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};

  ${({ $active }) =>
    $active
      ? `
    background: ${themeCssVariables.font.color.primary};
    color: ${themeCssVariables.background.primary};
    border-color: ${themeCssVariables.font.color.primary};
  `
      : `
    background: ${themeCssVariables.background.primary};
    color: ${themeCssVariables.font.color.primary};
    
    &:hover {
      background: ${themeCssVariables.background.secondary};
    }
  `}
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
`;

const ITEMS_PER_PAGE = 10;

export const AnnouncementsPage = () => {
  const { t } = useLingui();
  const { data: myWorkspaceData } = useMyWorkspaceData() as { data: any };

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const announcements = useMemo(
    () => myWorkspaceData?.myWorkspaceData?.announcementList || [],
    [myWorkspaceData],
  );

  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery) return announcements;
    const query = searchQuery.toLowerCase();
    return announcements.filter(
      (announcement: any) =>
        announcement.title?.toLowerCase().includes(query) ||
        announcement.body?.toLowerCase().includes(query),
    );
  }, [announcements, searchQuery]);

  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAnnouncements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAnnouncements, currentPage]);

  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);

  return (
    <PageContainer>
      <PageCardLayout
        header={
          <PageCardHeader
            icon={<IconBell size={themeCssVariables.icon.size.md} />}
            title={t`Announcements`}
          />
        }
      >
        <StyledContent>
          <StyledSearchBar>
            <StyledSearchInput>
              <IconSearch size={16} />
              <input
                type="text"
                placeholder={t`Search announcements...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </StyledSearchInput>
          </StyledSearchBar>

          <StyledAnnouncementList>
            {paginatedAnnouncements.length === 0 ? (
              <StyledEmptyState>
                <IconNotes size={48} style={{ opacity: 0.3 }} />
                {t`No announcements found`}
              </StyledEmptyState>
            ) : (
              paginatedAnnouncements.map((announcement: any) => (
                <StyledAnnouncementCard key={announcement.id}>
                  <StyledAnnouncementHeader>
                    <StyledAnnouncementTitle>
                      {announcement.title || t`Untitled Announcement`}
                    </StyledAnnouncementTitle>
                    <StyledAnnouncementDate>
                      {announcement.publishAt
                        ? new Date(
                            announcement.publishAt,
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '--'}
                    </StyledAnnouncementDate>
                  </StyledAnnouncementHeader>

                  {announcement.body && (
                    <StyledAnnouncementBody>
                      {announcement.body}
                    </StyledAnnouncementBody>
                  )}

                  <StyledAnnouncementMeta>
                    {announcement.publishAt &&
                      t`Published ${new Date(announcement.publishAt).toLocaleDateString()}`}
                  </StyledAnnouncementMeta>
                </StyledAnnouncementCard>
              ))
            )}
          </StyledAnnouncementList>

          {filteredAnnouncements.length > ITEMS_PER_PAGE && (
            <StyledPagination>
              <StyledPaginationInfo>
                {t`Show ${paginatedAnnouncements.length} from ${filteredAnnouncements.length} data`}
              </StyledPaginationInfo>
              <StyledPaginationButtons>
                <StyledPageButton
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft size={16} />
                </StyledPageButton>
                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <StyledPageButton
                    key={page}
                    $active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </StyledPageButton>
                ))}
                <StyledPageButton
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <IconChevronRight size={16} />
                </StyledPageButton>
              </StyledPaginationButtons>
            </StyledPagination>
          )}
        </StyledContent>
      </PageCardLayout>
    </PageContainer>
  );
};
