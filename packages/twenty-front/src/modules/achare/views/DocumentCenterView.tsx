import { useState } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconSearch,
  IconPlus,
  IconFileText,
  IconDownload,
  IconEye,
} from 'twenty-ui/icon';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  width: 100%;
  box-sizing: border-box;
`;

const StyledHeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledHeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledMainHeading = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
`;

const StyledSubHeading = styled.div`
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledSearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: 6px 12px;
  width: 220px;
`;

const StyledSearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.primary};
  width: 100%;

  &::placeholder {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid
    ${({ variant }) =>
      variant === 'primary'
        ? themeCssVariables.font.color.primary
        : themeCssVariables.border.color.medium};
  background: ${({ variant }) =>
    variant === 'primary'
      ? themeCssVariables.font.color.primary
      : themeCssVariables.background.primary};
  color: ${({ variant }) =>
    variant === 'primary'
      ? themeCssVariables.background.primary
      : themeCssVariables.font.color.primary};
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const StyledFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  overflow-x: auto;
  padding-bottom: 2px;
`;

const StyledFilterChip = styled.button<{ isActive: boolean }>`
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid
    ${({ isActive }) =>
      isActive ? themeCssVariables.font.color.primary : themeCssVariables.border.color.medium};
  background: ${({ isActive }) =>
    isActive ? themeCssVariables.font.color.primary : themeCssVariables.background.primary};
  color: ${({ isActive }) =>
    isActive ? themeCssVariables.background.primary : themeCssVariables.font.color.secondary};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledDocCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.border.color.medium};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
`;

const StyledDocTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${themeCssVariables.border.radius.sm};
  background: ${themeCssVariables.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${themeCssVariables.font.color.primary};
  flex-shrink: 0;
`;

const StyledDocInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StyledDocTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledDocCategory = styled.div`
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledDocMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.secondary};
  padding-top: ${themeCssVariables.spacing[2]};
  border-top: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledDocActions = styled.div`
  display: flex;
  gap: 8px;
`;

interface DocumentItem {
  id: string;
  title: string;
  category: string;
  size: string;
  updatedAt: string;
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Achare Employee Handbook 2026.pdf',
    category: 'HR Policies',
    size: '2.4 MB',
    updatedAt: 'Aug 15, 2026',
  },
  {
    id: 'doc-2',
    title: 'Standard Non-Disclosure Agreement (NDA).docx',
    category: 'Legal & NDAs',
    size: '180 KB',
    updatedAt: 'Jul 22, 2026',
  },
  {
    id: 'doc-3',
    title: 'Offer Letter Template — Senior Engineer.pdf',
    category: 'Offer Letters',
    size: '340 KB',
    updatedAt: 'Aug 02, 2026',
  },
  {
    id: 'doc-4',
    title: 'Company Leave & Remote Work Policy.pdf',
    category: 'HR Policies',
    size: '512 KB',
    updatedAt: 'Aug 10, 2026',
  },
  {
    id: 'doc-5',
    title: 'Statutory Form 16 Tax Compliance Guide.pdf',
    category: 'Tax & Compliance',
    size: '1.1 MB',
    updatedAt: 'Jun 30, 2026',
  },
  {
    id: 'doc-6',
    title: 'Standard Consulting Services Agreement.pdf',
    category: 'Legal & NDAs',
    size: '420 KB',
    updatedAt: 'Jul 14, 2026',
  },
];

export const DocumentCenterView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { enqueueSuccessSnackBar } = useSnackBar();

  const categories = ['All', 'HR Policies', 'Offer Letters', 'Legal & NDAs', 'Tax & Compliance'];

  const filteredDocs = DOCUMENTS.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDownload = (docName: string) => {
    enqueueSuccessSnackBar({ message: `Downloaded: ${docName}` });
  };

  return (
    <StyledContainer>
      <StyledHeaderRow>
        <StyledHeaderTitle>
          <StyledMainHeading>Document Center & Compliance</StyledMainHeading>
          <StyledSubHeading>
            Company policies, employee contracts, NDA templates & tax forms
          </StyledSubHeading>
        </StyledHeaderTitle>

        <StyledControls>
          <StyledSearchWrap>
            <IconSearch size={14} />
            <StyledSearchInput
              placeholder="Search document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </StyledSearchWrap>
          <StyledButton variant="primary">
            <IconPlus size={14} />
            <span>Upload Document</span>
          </StyledButton>
        </StyledControls>
      </StyledHeaderRow>

      <StyledFilterRow>
        {categories.map((cat) => (
          <StyledFilterChip
            key={cat}
            isActive={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </StyledFilterChip>
        ))}
      </StyledFilterRow>

      <StyledGrid>
        {filteredDocs.map((doc) => (
          <StyledDocCard key={doc.id}>
            <StyledDocTop>
              <StyledIconWrap>
                <IconFileText size={20} />
              </StyledIconWrap>
              <StyledDocInfo>
                <StyledDocTitle title={doc.title}>{doc.title}</StyledDocTitle>
                <StyledDocCategory>{doc.category}</StyledDocCategory>
              </StyledDocInfo>
            </StyledDocTop>

            <StyledDocMeta>
              <span>{doc.size} • {doc.updatedAt}</span>
              <StyledDocActions>
                <button
                  onClick={() => handleDownload(doc.title)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: themeCssVariables.font.color.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  title="Download"
                >
                  <IconDownload size={14} />
                </button>
              </StyledDocActions>
            </StyledDocMeta>
          </StyledDocCard>
        ))}
      </StyledGrid>
    </StyledContainer>
  );
};
