import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useMemo, useState } from 'react';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { PageCardHeader } from '@/ui/layout/page/components/PageCardHeader';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconFile,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconFileText,
  IconDownload,
} from 'twenty-ui/icon';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useMyWorkspaceData } from '@/hr/hooks/useMyWorkspaceData';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

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

const StyledTableWrapper = styled.div`
  padding: 0 ${themeCssVariables.spacing[4]};
  overflow-x: auto;
`;

const StyledGrid = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledGridHeader = styled.th`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-align: left;
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledGridCell = styled.td`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledFileName = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledFileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${themeCssVariables.border.radius.sm};
  background: ${themeCssVariables.background.secondary};
  color: ${themeCssVariables.font.color.secondary};
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
`;

const ITEMS_PER_PAGE = 10;

const getFileTypeIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  if (['pdf'].includes(ext || '')) return IconFileText;
  if (['doc', 'docx'].includes(ext || '')) return IconFileText;
  if (['xls', 'xlsx'].includes(ext || '')) return IconFileText;
  return IconFile;
};

const getFileTypeLabel = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
      return 'Word';
    case 'xls':
    case 'xlsx':
      return 'Excel';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'Image';
    default:
      return ext?.toUpperCase() || 'File';
  }
};

export const MyDocumentsPage = () => {
  const { t } = useLingui();
  const { enqueueSuccessSnackBar } = useSnackBar();
  const { data: myWorkspaceData } = useMyWorkspaceData() as { data: any };

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { records: attachments, loading } = useFindManyRecords({
    objectNameSingular: 'attachment',
    filter: {
      and: [
        myWorkspaceData?.myWorkspaceData?.employeeId
          ? {
              employeeId: {
                eq: myWorkspaceData.myWorkspaceData.employeeId,
              },
            }
          : undefined,
      ].filter(Boolean) as any,
    },
    orderBy: [{ createdAt: 'DescNullsLast' }],
    limit: 100,
  });

  const filteredDocuments = useMemo(() => {
    if (!searchQuery) return attachments;
    const query = searchQuery.toLowerCase();
    return attachments.filter(
      (doc: any) =>
        doc.name?.toLowerCase().includes(query) ||
        doc.mimeType?.toLowerCase().includes(query),
    );
  }, [attachments, searchQuery]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDocuments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDocuments, currentPage]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);

  return (
    <PageContainer>
      <PageCardLayout
        header={
          <PageCardHeader
            icon={<IconFile size={themeCssVariables.icon.size.md} />}
            title={t`My Documents`}
          />
        }
      >
        <StyledContent>
          <StyledSearchBar>
            <StyledSearchInput>
              <IconSearch size={16} />
              <input
                type="text"
                placeholder={t`Search documents...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </StyledSearchInput>
          </StyledSearchBar>

          <StyledTableWrapper>
            <StyledGrid>
              <thead>
                <tr>
                  <StyledGridHeader>{t`File Name`}</StyledGridHeader>
                  <StyledGridHeader>{t`Type`}</StyledGridHeader>
                  <StyledGridHeader>{t`Uploaded`}</StyledGridHeader>
                  <StyledGridHeader>{t`Size`}</StyledGridHeader>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                      {t`Loading...`}
                    </td>
                  </tr>
                ) : paginatedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <StyledEmptyState>
                        {t`No documents found`}
                      </StyledEmptyState>
                    </td>
                  </tr>
                ) : (
                  paginatedDocuments.map((doc: any) => {
                    const FileIcon = getFileTypeIcon(doc.name || '');
                    return (
                      <tr key={doc.id}>
                        <StyledGridCell>
                          <StyledFileName>
                            <StyledFileIcon>
                              <FileIcon size={14} />
                            </StyledFileIcon>
                            {doc.name || 'Untitled'}
                          </StyledFileName>
                        </StyledGridCell>
                        <StyledGridCell>
                          {getFileTypeLabel(doc.name || '')}
                        </StyledGridCell>
                        <StyledGridCell>
                          {doc.createdAt
                            ? new Date(doc.createdAt).toLocaleDateString()
                            : '--'}
                        </StyledGridCell>
                        <StyledGridCell>
                          {doc.size
                            ? `${(doc.size / 1024).toFixed(1)} KB`
                            : '--'}
                        </StyledGridCell>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </StyledGrid>
          </StyledTableWrapper>

          {filteredDocuments.length > ITEMS_PER_PAGE && (
            <StyledPagination>
              <StyledPaginationInfo>
                {t`Show ${paginatedDocuments.length} from ${filteredDocuments.length} data`}
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
