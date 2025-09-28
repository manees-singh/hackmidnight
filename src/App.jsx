import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Badge,
  Icon,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  useColorMode,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  extendTheme
} from '@chakra-ui/react';
import { 
  CheckCircle, 
  XCircle, 
  Lock, 
  User, 
  LogOut, 
  FileText, 
  Shield, 
  Hash,
  CreditCard,
  GraduationCap,
  Moon,
  Sun,
  ChevronDown,
  Home,
  ClipboardList,
  Activity,
  Search
} from 'lucide-react';

// Custom theme configuration
const theme = extendTheme({
  colors: {
    brand: {
      50: '#E5E7FF',
      100: '#C0C4FF',
      200: '#9BA0FF',
      300: '#767DFF',
      400: '#5159FF',
      500: '#2C36FF',
      600: '#1522E5',
      700: '#0F1AAB',
      800: '#0A1170',
      900: '#050936',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

// Auth Context for managing user role across the app
const AuthContext = createContext(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (role) => {
    setUser({ role, loginTime: new Date().toISOString() });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Enhanced Mock Database with more realistic data
const mockDatabase = {
  'STU001': { 
    name: 'Alice Johnson',
    dob: '2003-01-01', 
    enrollmentStatus: 'active', 
    ssnValid: true,
    email: 'alice.johnson@university.edu',
    major: 'Computer Science'
  },
  'STU002': { 
    name: 'Bob Smith',
    dob: '2002-05-15', 
    enrollmentStatus: 'graduated', 
    ssnValid: true,
    email: 'bob.smith@university.edu',
    major: 'Mathematics'
  },
  'STU003': { 
    name: 'Carol Davis',
    dob: '2004-08-20', 
    enrollmentStatus: 'active', 
    ssnValid: false,
    email: 'carol.davis@university.edu',
    major: 'Engineering'
  },
  'STU004': { 
    name: 'David Wilson',
    dob: '2003-11-30', 
    enrollmentStatus: 'inactive', 
    ssnValid: true,
    email: 'david.wilson@university.edu',
    major: 'Business'
  },
  'STU005': { 
    name: 'Eva Brown',
    dob: '2002-12-25', 
    enrollmentStatus: 'active', 
    ssnValid: true,
    email: 'eva.brown@university.edu',
    major: 'Biology'
  }
};

// Enhanced API Service - No expected value needed!
const mockAPI = {
  // Verify without needing expected value - system checks internally
  verify: async (studentId, attribute) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const student = mockDatabase[studentId];
    
    if (!student) {
      return {
        status: 'not_found',
        proofHash: `0x${Math.random().toString(36).substr(2, 9)}`,
        message: 'Student ID not found in database',
        attribute: attribute,
        studentExists: false
      };
    }

    // For demonstration, we'll simulate different scenarios based on attribute
    let isValid = true;
    let message = '';
    
    switch(attribute) {
      case 'dob':
        // Simulate DOB verification (always valid for demo)
        isValid = true;
        message = 'Date of Birth verification successful';
        break;
      case 'enrollmentStatus':
        // Check if student is actively enrolled
        isValid = student.enrollmentStatus === 'active';
        message = isValid ? 'Student is actively enrolled' : 'Student is not actively enrolled';
        break;
      case 'ssnValid':
        // Check SSN validity
        isValid = student.ssnValid;
        message = isValid ? 'SSN is valid and active' : 'SSN is invalid or inactive';
        break;
      default:
        return {
          status: 'unauthorized',
          proofHash: `0x${Math.random().toString(36).substr(2, 9)}`,
          message: 'Invalid attribute for verification',
          attribute: attribute,
          studentExists: true
        };
    }

    const status = isValid ? 'verified' : 'mismatch';
    
    return {
      status: status,
      proofHash: `0x${Math.random().toString(36).substr(2, 9)}`,
      message: message,
      attribute: attribute,
      studentExists: true,
      studentName: student.name // Only return non-sensitive info
    };
  },

  // New function to check if student exists
  checkStudent: async (studentId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const student = mockDatabase[studentId];
    return {
      exists: !!student,
      name: student?.name || '',
      id: studentId
    };
  }
};

// Navbar Component (same as before)
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'it': return <Shield size={16} />;
      case 'registrar': return <GraduationCap size={16} />;
      case 'payroll': return <CreditCard size={16} />;
      default: return <User size={16} />;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'it': return 'blue';
      case 'registrar': return 'green';
      case 'payroll': return 'purple';
      default: return 'gray';
    }
  };

  if (!user) return null;

  return (
    <Box bg={bg} px={4} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="1400px" mx="auto">
        <HStack spacing={8}>
          <HStack spacing={2}>
            <Icon as={Shield} w={6} h={6} color="brand.500" />
            <Text fontSize="xl" fontWeight="bold">Midnight Verify</Text>
          </HStack>
          
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Button
              leftIcon={<Home size={16} />}
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
            <Button
              leftIcon={<ClipboardList size={16} />}
              variant="ghost"
              onClick={() => navigate('/audit')}
            >
              Audit Log
            </Button>
          </HStack>
        </HStack>

        <HStack spacing={4}>
          <Badge colorScheme={getRoleColor(user.role)} px={3} py={1} borderRadius="full" fontSize="sm">
            <HStack spacing={1}>
              {getRoleIcon(user.role)}
              <Text>{user.role.toUpperCase()}</Text>
            </HStack>
          </Badge>
          
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            onClick={toggleColorMode}
            variant="ghost"
          />
          
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDown size={16} />} variant="outline" size="sm">
              <Avatar size="xs" name={user.role} />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<User size={16} />}>Profile</MenuItem>
              <MenuItem icon={<Activity size={16} />}>Activity</MenuItem>
              <Divider />
              <MenuItem icon={<LogOut size={16} />} onClick={handleLogout} color="red.500">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

// Login Page Component (same as before)
const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleLogin = async () => {
    if (!selectedRole) {
      toast({
        title: 'Please select a role',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    login(selectedRole);
    toast({
      title: 'Login successful',
      description: `Logged in as ${selectedRole.toUpperCase()}`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    navigate('/dashboard');
  };

  return (
    <Box minH="100vh" bg={bg}>
      <Container maxW="lg" pt={20}>
        <VStack spacing={8}>
          <VStack spacing={2}>
            <Icon as={Shield} w={16} h={16} color="brand.500" />
            <Heading size="2xl">Midnight Verify</Heading>
            <Text color="gray.500" textAlign="center">
              Zero-Knowledge Identity Verification System
            </Text>
          </VStack>

          <Card w="full" maxW="md" bg={cardBg}>
            <CardHeader>
              <Heading size="md" textAlign="center">Select Your Role</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel>Department Role</FormLabel>
                  <Select
                    placeholder="Choose your department role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    size="lg"
                  >
                    <option value="it">IT Support</option>
                    <option value="registrar">Registrar Office</option>
                    <option value="payroll">Payroll Officer</option>
                  </Select>
                </FormControl>

                {selectedRole && (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Role Permissions</AlertTitle>
                      <AlertDescription>
                        {selectedRole === 'it' && 'Can verify: Date of Birth validity'}
                        {selectedRole === 'registrar' && 'Can verify: Date of Birth, Enrollment Status'}
                        {selectedRole === 'payroll' && 'Can verify: Date of Birth, SSN Validity'}
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}

                <Button
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  onClick={handleLogin}
                  isLoading={isLoading}
                  loadingText="Logging in..."
                  isDisabled={!selectedRole}
                >
                  Login
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Zero-Knowledge Verification: You verify attributes without seeing the actual data
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

// Dashboard Page Component - UPDATED for zero-knowledge verification
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [attribute, setAttribute] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingStudent, setCheckingStudent] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const toast = useToast();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Get allowed attributes based on role
  const getAllowedAttributes = () => {
    switch(user.role) {
      case 'it':
        return [{ value: 'dob', label: 'Date of Birth Validity' }];
      case 'registrar':
        return [
          { value: 'dob', label: 'Date of Birth Validity' },
          { value: 'enrollmentStatus', label: 'Enrollment Status' }
        ];
      case 'payroll':
        return [
          { value: 'dob', label: 'Date of Birth Validity' },
          { value: 'ssnValid', label: 'SSN Validity' }
        ];
      default:
        return [];
    }
  };

  // Load audit logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('auditLogs');
    if (savedLogs) {
      setAuditLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Save audit logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Check student existence when ID changes
  useEffect(() => {
    const checkStudentExists = async () => {
      if (studentId.length >= 3) {
        setCheckingStudent(true);
        try {
          const result = await mockAPI.checkStudent(studentId);
          setStudentInfo(result);
        } catch (error) {
          setStudentInfo(null);
        } finally {
          setCheckingStudent(false);
        }
      } else {
        setStudentInfo(null);
      }
    };

    const timeoutId = setTimeout(checkStudentExists, 500);
    return () => clearTimeout(timeoutId);
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!studentId || !attribute) {
      toast({
        title: 'Missing Information',
        description: 'Please select a student and attribute',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);

    try {
      // NO EXPECTED VALUE NEEDED - system checks internally!
      const result = await mockAPI.verify(studentId, attribute);
      
      setVerificationResult(result);
      
      // Add to audit log
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        studentId,
        studentName: result.studentName || 'Unknown',
        attribute: getAllowedAttributes().find(a => a.value === attribute)?.label,
        result: result.status,
        proofHash: result.proofHash,
        verifier: user.role,
        message: result.message
      };
      
      setAuditLogs(prev => [newLog, ...prev]);
      
      // Show toast notification
      const toastStatus = result.status === 'verified' ? 'success' : 
                         result.status === 'mismatch' ? 'error' : 
                         result.status === 'not_found' ? 'warning' : 'warning';
      
      toast({
        title: result.status === 'verified' ? 'Verification Successful' : 
               result.status === 'mismatch' ? 'Verification Failed' : 
               result.status === 'not_found' ? 'Student Not Found' : 'Unauthorized',
        description: result.message,
        status: toastStatus,
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Verification Error',
        description: 'An error occurred during verification',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getResultIcon = (status) => {
    switch(status) {
      case 'verified':
        return <CheckCircle size={48} color="#48BB78" />;
      case 'mismatch':
        return <XCircle size={48} color="#F56565" />;
      case 'not_found':
        return <Lock size={48} color="#ED8936" />;
      case 'unauthorized':
        return <Lock size={48} color="#E53E3E" />;
      default:
        return null;
    }
  };

  const getResultColor = (status) => {
    switch(status) {
      case 'verified': return 'green';
      case 'mismatch': return 'red';
      case 'not_found': return 'orange';
      case 'unauthorized': return 'red';
      default: return 'gray';
    }
  };

  // Calculate statistics
  const stats = {
    total: auditLogs.filter(log => log.verifier === user.role).length,
    verified: auditLogs.filter(log => log.verifier === user.role && log.result === 'verified').length,
    failed: auditLogs.filter(log => log.verifier === user.role && (log.result === 'mismatch' || log.result === 'not_found')).length,
  };

  return (
    <Box minH="100vh" bg={bg}>
      <Navbar />
      <Container maxW="1400px" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Header */}
          <Card bg={cardBg}>
            <CardBody>
              <HStack justify="space-between">
                <Box>
                  <Heading size="lg">Welcome back, {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Officer</Heading>
                  <Text color="gray.500" mt={1}>
                    Zero-Knowledge Verification: Confirm attributes without seeing sensitive data
                  </Text>
                </Box>
                <Icon as={Shield} w={12} h={12} color="brand.500" />
              </HStack>
            </CardBody>
          </Card>

          {/* Statistics */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Verifications</StatLabel>
                  <StatNumber>{stats.total}</StatNumber>
                  <StatHelpText>This session</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Successful</StatLabel>
                  <StatNumber color="green.500">{stats.verified}</StatNumber>
                  <StatHelpText>{stats.total > 0 ? `${Math.round(stats.verified/stats.total * 100)}%` : '0%'} success rate</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Failed/Not Found</StatLabel>
                  <StatNumber color="red.500">{stats.failed}</StatNumber>
                  <StatHelpText>Issues found</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Verification Form - UPDATED: No expected value field */}
            <Card bg={cardBg}>
              <CardHeader>
                <Heading size="md">Zero-Knowledge Verification</Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Student ID</FormLabel>
                      <Input
                        placeholder="Enter student ID (e.g., STU001)"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                        isDisabled={isLoading}
                        leftIcon={<Search size={16} />}
                      />
                      {checkingStudent && (
                        <Text fontSize="sm" color="blue.500">Checking student...</Text>
                      )}
                      {studentInfo && (
                        <Alert status={studentInfo.exists ? "success" : "warning"} size="sm" mt={2}>
                          <AlertIcon />
                          {studentInfo.exists ? 
                            `Student found: ${studentInfo.name}` : 
                            'Student not found in database'
                          }
                        </Alert>
                      )}
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Attribute to Verify</FormLabel>
                      <Select
                        placeholder="Select attribute to verify"
                        value={attribute}
                        onChange={(e) => setAttribute(e.target.value)}
                        isDisabled={isLoading}
                      >
                        {getAllowedAttributes().map(attr => (
                          <option key={attr.value} value={attr.value}>
                            {attr.label}
                          </option>
                        ))}
                      </Select>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        You won't see the actual value - system verifies internally
                      </Text>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      isLoading={isLoading}
                      loadingText="Verifying..."
                      leftIcon={<Shield size={20} />}
                      isDisabled={!studentId || !attribute}
                    >
                      Verify Attribute
                    </Button>
                  </VStack>
                </form>

                {/* Zero-Knowledge Explanation */}
                <Alert status="info" mt={4} borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Zero-Knowledge Verification</AlertTitle>
                    <AlertDescription>
                      The system checks the attribute against the database without revealing the actual value to you.
                      You only see whether the verification passed or failed.
                    </AlertDescription>
                  </Box>
                </Alert>
              </CardBody>
            </Card>

            {/* Verification Result */}
            <Card bg={cardBg}>
              <CardHeader>
                <Heading size="md">Verification Result</Heading>
              </CardHeader>
              <CardBody>
                {verificationResult ? (
                  <VStack spacing={4}>
                    <Box textAlign="center">
                      {getResultIcon(verificationResult.status)}
                    </Box>
                    
                    <Badge 
                      colorScheme={getResultColor(verificationResult.status)} 
                      fontSize="lg" 
                      px={4} 
                      py={2}
                      borderRadius="full"
                    >
                      {verificationResult.status.toUpperCase().replace('_', ' ')}
                    </Badge>

                    <Text textAlign="center" color="gray.500">
                      {verificationResult.message}
                    </Text>

                    {verificationResult.studentName && (
                      <Box w="full" p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                        <Text fontSize="sm" fontWeight="bold">Student: {verificationResult.studentName}</Text>
                        <Text fontSize="xs" color="gray.500">ID: {studentId}</Text>
                      </Box>
                    )}

                    <Box w="full" p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                      <HStack>
                        <Icon as={Hash} />
                        <Box>
                          <Text fontSize="sm" fontWeight="bold">Zero-Knowledge Proof Hash</Text>
                          <Text fontSize="xs" fontFamily="mono">{verificationResult.proofHash}</Text>
                        </Box>
                      </HStack>
                    </Box>

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      This cryptographic proof confirms the verification was performed
                      without exposing any sensitive data to you
                    </Text>
                  </VStack>
                ) : (
                  <VStack spacing={4} py={8}>
                    <Icon as={FileText} w={12} h={12} color="gray.400" />
                    <Text color="gray.500" textAlign="center">
                      Submit a verification request to see zero-knowledge results
                    </Text>
                    <Text fontSize="sm" color="gray.400" textAlign="center">
                      You verify attributes without ever seeing the actual confidential data
                    </Text>
                  </VStack>
                )}
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Recent Verifications */}
          {auditLogs.filter(log => log.verifier === user.role).length > 0 && (
            <Card bg={cardBg}>
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md">Recent Zero-Knowledge Verifications</Heading>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/audit')}>
                    View All
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Time</Th>
                        <Th>Student</Th>
                        <Th>Attribute</Th>
                        <Th>Result</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {auditLogs
                        .filter(log => log.verifier === user.role)
                        .slice(0, 5)
                        .map(log => (
                          <Tr key={log.id}>
                            <Td>{new Date(log.timestamp).toLocaleTimeString()}</Td>
                            <Td>
                              <Box>
                                <Text fontFamily="mono" fontSize="xs">{log.studentId}</Text>
                                <Text fontSize="xs" color="gray.500">{log.studentName}</Text>
                              </Box>
                            </Td>
                            <Td>{log.attribute}</Td>
                            <Td>
                              <Badge colorScheme={getResultColor(log.result)}>
                                {log.result}
                              </Badge>
                            </Td>
                          </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

// Audit Log Page Component - Updated for zero-knowledge
const AuditLog = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const savedLogs = localStorage.getItem('auditLogs');
    if (savedLogs) {
      setAuditLogs(JSON.parse(savedLogs));
    }
  }, []);

  const getResultColor = (status) => {
    switch(status) {
      case 'verified': return 'green';
      case 'mismatch': return 'red';
      case 'not_found': return 'orange';
      case 'unauthorized': return 'red';
      default: return 'gray';
    }
  };

  const getResultIcon = (status) => {
    switch(status) {
      case 'verified': return <CheckCircle size={16} />;
      case 'mismatch': return <XCircle size={16} />;
      case 'not_found': return <Lock size={16} />;
      case 'unauthorized': return <Lock size={16} />;
      default: return null;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (log.verifier !== user.role) return false;
    if (filter === 'all') return true;
    return log.result === filter;
  });

  const clearLogs = () => {
    const updatedLogs = auditLogs.filter(log => log.verifier !== user.role);
    setAuditLogs(updatedLogs);
    localStorage.setItem('auditLogs', JSON.stringify(updatedLogs));
  };

  return (
    <Box minH="100vh" bg={bg}>
      <Navbar />
      <Container maxW="1400px" py={8}>
        <VStack spacing={6} align="stretch">
          <Card bg={cardBg}>
            <CardBody>
              <HStack justify="space-between">
                <Box>
                  <Heading size="lg">Zero-Knowledge Audit Log</Heading>
                  <Text color="gray.500" mt={1}>
                    Complete history of all zero-knowledge verification attempts
                  </Text>
                </Box>
                <Icon as={ClipboardList} w={12} h={12} color="brand.500" />
              </HStack>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardHeader>
              <HStack justify="space-between">
                <HStack spacing={4}>
                  <Text fontWeight="bold">Filter:</Text>
                  <Select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    w="200px"
                    size="sm"
                  >
                    <option value="all">All Results</option>
                    <option value="verified">Verified Only</option>
                    <option value="mismatch">Mismatches Only</option>
                    <option value="not_found">Not Found</option>
                  </Select>
                </HStack>
                <Button 
                  size="sm" 
                  colorScheme="red" 
                  variant="ghost"
                  onClick={clearLogs}
                  isDisabled={filteredLogs.length === 0}
                >
                  Clear My Logs
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              {filteredLogs.length > 0 ? (
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Date & Time</Th>
                        <Th>Student</Th>
                        <Th>Attribute</Th>
                        <Th>Result</Th>
                        <Th>Proof Hash</Th>
                        <Th>Message</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredLogs.map(log => (
                        <Tr key={log.id}>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm">
                                {new Date(log.timestamp).toLocaleDateString()}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Box>
                              <Text fontFamily="mono" fontSize="sm">{log.studentId}</Text>
                              <Text fontSize="xs" color="gray.500">{log.studentName}</Text>
                            </Box>
                          </Td>
                          <Td>{log.attribute}</Td>
                          <Td>
                            <Badge 
                              colorScheme={getResultColor(log.result)}
                            >
                              <HStack spacing={1}>
                                {getResultIcon(log.result)}
                                <Text>{log.result.toUpperCase()}</Text>
                              </HStack>
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="xs" fontFamily="mono" color="gray.500">
                              {log.proofHash.substring(0, 12)}...
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="xs" color="gray.600">
                              {log.message}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <VStack py={12} spacing={4}>
                  <Icon as={FileText} w={16} h={16} color="gray.400" />
                  <Text color="gray.500" fontSize="lg">No zero-knowledge verifications yet</Text>
                  <Text color="gray.400" fontSize="sm">
                    Zero-knowledge verification attempts will appear here
                  </Text>
                </VStack>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

// Main App Component
const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/audit" 
              element={
                <ProtectedRoute>
                  <AuditLog />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;