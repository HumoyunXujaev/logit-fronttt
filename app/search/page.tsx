'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/contexts/i18n';
import NavigationMenu from '@/app/components/NavigationMenu';
import {
  ArrowLeft,
  Search,
  User,
  Shield,
  Star,
  Building2,
  Loader2,
  MapPin,
  TruckIcon,
  GraduationCap,
  Package,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  telegram_id: string;
  username: string;
  full_name: string;
  type: string;
  role: string;
  company_name?: string;
  phone_number?: string;
  whatsapp_number?: string;
  rating: number;
  is_verified: boolean;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export default function UsersDirectory() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { userState } = useUser();
  const { t } = useTranslation();
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  useEffect(() => {
    // Initialize search from URL query params
    const query = searchParams.get('q') || '';
    const roleParam = searchParams.get('role') || 'all';
    const typeParam = searchParams.get('type') || 'all';
    const page = searchParams.get('page') || '1';

    setSearch(query);
    setRole(roleParam);
    setType(typeParam);
    setCurrentPage(parseInt(page, 10));

    fetchUsers(query, roleParam, typeParam, parseInt(page, 10));
  }, [searchParams]);

  const fetchUsers = async (
    query: string,
    userRole: string,
    userType: string,
    page: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (userRole && userRole !== 'all') params.append('role', userRole);
      if (userType && userType !== 'all') params.append('type', userType);
      params.append('page', page.toString());

      const response = await api.get(`/users/search/?${params.toString()}`);
      setUsers(response.results);
      setTotalCount(response.count);

      // Calculate total pages
      const pageSize = 20; // Based on backend pagination
      setTotalPages(Math.ceil(response.count / pageSize));
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(search, role, type, 1);

    // Update URL params for shareable links
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (search) params.set('q', search);
    else params.delete('q');

    if (role) params.set('role', role);
    else params.delete('role');

    if (type) params.set('type', type);
    else params.delete('type');

    params.set('page', '1');
    window.history.pushState({}, '', `${url.pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(search, role, type, page);

    // Update URL params
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set('page', page.toString());
    window.history.pushState({}, '', `${url.pathname}?${params.toString()}`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'carrier':
        return <TruckIcon className='h-5 w-5 text-blue-600' />;
      case 'cargo-owner':
        return <Package className='h-5 w-5 text-blue-600' />;
      case 'logistics-company':
        return <Building2 className='h-5 w-5 text-blue-600' />;
      case 'student':
        return <GraduationCap className='h-5 w-5 text-blue-600' />;
      default:
        return <User className='h-5 w-5 text-blue-600' />;
    }
  };

  const getRoleLabel = (roleValue: string) => {
    return t(`reviews.userRoles.${roleValue}`) || roleValue;
  };

  const getTypeLabel = (typeValue: string) => {
    const types: Record<string, string> = {
      individual: t('selectPerson.individual'),
      legal: t('selectPerson.legal'),
    };
    return types[typeValue] || typeValue;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className='mt-4'>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Logic to show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageNum);
                  }}
                  isActive={currentPage === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900 p-4 pb-20'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='max-w-4xl mx-auto'
      >
        <motion.div
          variants={itemVariants}
          className='flex items-center mb-6 bg-white dark:bg-blue-800/30 p-3 rounded-lg shadow-sm'
        >
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mr-4 hover:bg-blue-100 dark:hover:bg-blue-700/50'
          >
            <ArrowLeft className='h-6 w-6 text-blue-600 dark:text-blue-300' />
          </Button>
          <h1 className='text-2xl font-bold text-blue-800 dark:text-white'>
            {t('search.directory')}
          </h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className='mb-8 p-4 bg-white dark:bg-blue-800/30 rounded-lg shadow-sm'
        >
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='col-span-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder={t('search.searchByName')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.role')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('search.allRoles')}</SelectItem>
                <SelectItem value='student'>
                  {t('reviews.userRoles.student')}
                </SelectItem>
                <SelectItem value='carrier'>
                  {t('reviews.userRoles.carrier')}
                </SelectItem>
                <SelectItem value='cargo-owner'>
                  {t('reviews.userRoles.cargo-owner')}
                </SelectItem>
                <SelectItem value='logistics-company'>
                  {t('reviews.userRoles.logistics-company')}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('search.allTypes')}</SelectItem>
                <SelectItem value='individual'>
                  {t('selectPerson.individual')}
                </SelectItem>
                <SelectItem value='legal'>{t('selectPerson.legal')}</SelectItem>
              </SelectContent>
            </Select>

            <div className='col-span-1 md:col-span-4'>
              <Button
                onClick={handleSearch}
                className='w-full md:w-auto bg-blue-600 hover:bg-blue-700'
              >
                <Search className='h-4 w-4 mr-2' />
                {t('common.search')}
              </Button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <motion.div
            variants={itemVariants}
            className='flex flex-col items-center justify-center py-12'
          >
            <Loader2 className='h-12 w-12 animate-spin text-blue-600 mb-4' />
            <p className='text-lg text-blue-600 animate-pulse'>
              {t('common.loading')}
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            variants={itemVariants}
            className='p-4 bg-red-50 text-red-600 rounded-lg mb-4'
          >
            {error}
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants} className='mb-4'>
              <p>
                {t('search.found')} {totalCount} {t('search.users')}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            >
              {users?.map((user) => (
                <motion.div key={user.telegram_id} variants={itemVariants}>
                  <Card className='overflow-hidden h-full hover:shadow-md transition-all duration-200'>
                    <CardHeader className='pb-2'>
                      <div className='flex justify-between items-start'>
                        <CardTitle className='text-lg flex items-center'>
                          <span className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2'>
                            {getRoleIcon(user.role)}
                          </span>
                          {user.full_name}
                        </CardTitle>
                        {user.is_verified && (
                          <Badge
                            variant='outline'
                            className='bg-green-50 text-green-700'
                          >
                            <Shield className='h-3 w-3 mr-1' />{' '}
                            {t('menu.verified')}
                          </Badge>
                        )}
                      </div>
                      {user.username && (
                        <p className='text-sm text-muted-foreground'>
                          @{user.username}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className='pb-2'>
                      <div className='flex flex-col gap-2'>
                        {user.company_name && (
                          <p className='text-sm flex'>
                            <Building2 className='h-4 w-4 mr-1 text-blue-500' />
                            <span className='font-medium'>
                              {user.company_name}
                            </span>
                          </p>
                        )}

                        <div className='flex gap-2 my-1'>
                          <Badge variant='secondary'>
                            {getRoleLabel(user.role)}
                          </Badge>
                          <Badge variant='outline'>
                            {getTypeLabel(user.type)}
                          </Badge>
                        </div>

                        {user.rating > 0 && (
                          <div className='flex items-center'>
                            <span className='text-sm mr-1'>
                              {t('reviews.rating')}:
                            </span>
                            <span className='text-yellow-500'>
                              {'★'.repeat(Math.round(user.rating))}
                            </span>
                            <span className='text-gray-300'>
                              {'★'.repeat(5 - Math.round(user.rating))}
                            </span>
                            <span className='ml-1 text-sm'>
                              ({user.rating.toFixed(1)})
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className='pt-0 mt-auto'>
                      <Link
                        href={`/search/${user.telegram_id}`}
                        className='w-full'
                      >
                        <Button
                          variant='outline'
                          size='sm'
                          className='w-full border-blue-200 text-blue-600 hover:bg-blue-50'
                        >
                          {t('search.viewProfile')}
                          <ChevronRight className='h-4 w-4 ml-1' />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {users?.length === 0 && (
              <motion.div
                variants={itemVariants}
                className='text-center py-12 bg-white dark:bg-blue-800/30 rounded-lg mt-4'
              >
                <User className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                <p className='text-lg text-gray-500 dark:text-gray-300'>
                  {t('search.noUsersFound')}
                </p>
                <p className='text-gray-400 dark:text-gray-400'>
                  {t('search.tryDifferentSearch')}
                </p>
              </motion.div>
            )}

            {renderPagination()}
          </>
        )}
      </motion.div>

      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
}
