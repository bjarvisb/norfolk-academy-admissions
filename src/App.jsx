import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, X, ChevronDown, ChevronUp, LayoutGrid, List, Trash2 } from 'lucide-react';

// GOOGLE APPS SCRIPT WEB APP URL - Proxied through Vercel API
const SCRIPT_URL = '/api/sheet';

const UVAColors = {
  blue: '#232D4B',
  blueLight: '#2d3a5c',
  orange: '#F84C1E',
  lightGray: '#F7F7F7',
  mediumGray: '#E5E5E5',
  darkGray: '#666666',
  textGray: '#4A4A4A'
};

const statusOptions = [
  'Applicant',
  'Admissions Event',
  'Showcase',
  'Withdrawn',
  'No Longer In Contact'
];

// Status colors - Applicant is GREEN
const getStatusColor = (status) => {
  if (status === 'Applicant') return '#059669'; // Green - active applicant
  if (status === 'Admissions Event') return '#232D4B'; // Blue - engaged
  if (status === 'Showcase') return '#8B5CF6'; // Purple - special event
  if (status === 'Withdrawn') return '#DC2626'; // Red - ended
  if (status === 'No Longer In Contact') return '#DC2626'; // Red - ended
  
  // Legacy support for old status name
  if (status === 'Admissions Event') return '#232D4B';
  
  return '#6B7280';
};

const gradeOptions = ['6', '7', '8', '9', '10'];
const gradeLabels = {
  '6': '6th',
  '7': '7th', 
  '8': '8th',
  '9': '9th',
  '10': '10th'
};

// School divisions
const gradeDivisions = {
  '6': 'Lower',
  '7': 'Middle',
  '8': 'Middle',
  '9': 'Middle',
  '10': 'Upper'
};

const sportsList = [
  'Baseball', 'Basketball', 'Cheering', 'Crew', 'Cross Country', 'Field Hockey', 
  'Football', 'Golf', 'Lacrosse', 'Sailing', 'Soccer', 'Softball', 'Swimming',
  'Tennis', 'Track & Field', 'Volleyball', 'Wrestling'
];

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterGrades, setFilterGrades] = useState([]);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [viewMode, setViewMode] = useState('table');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  
  const statusDropdownRef = useRef(null);
  const gradeDropdownRef = useRef(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getData`);
      const data = await response.json();
      if (data.students && data.students.length > 0) {
        setStudents(data.students);
      } else {
        setStudents(getSampleData());
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents(getSampleData());
    }
    setLoading(false);
  };

  const getSampleData = () => {
    return [
      // 6th Grade (3 students)
      {
        id: 1,
        name: 'Maya Anderson',
        grade: '6',
        parentNames: 'Robert and Jennifer Anderson',
        sports: ['Soccer', 'Track & Field'],
        currentSchool: 'Larchmont Elementary',
        statuses: ['Applicant'],
        admissionsNotes: [
          { text: 'Strong academic student with interest in STEM programs. Parents impressed with lower school curriculum during tour. -BJ', date: '2026-02-09' }
        ],
        athleticsNotes: [
          { text: 'Plays club soccer and runs track. Good speed and coordination for age. Coachable attitude. -JM', date: '2026-02-09' }
        ],
        athleticsContact: 'Coach Martinez',
        familyConnections: ''
      },
      {
        id: 4,
        name: 'James Rodriguez',
        grade: '6',
        parentNames: 'Miguel and Sofia Rodriguez',
        sports: ['Baseball', 'Swimming'],
        currentSchool: 'Ghent Elementary',
        statuses: ['Applicant', 'Admissions Event'],
        admissionsNotes: [
          { text: 'Family attended lower school preview event. Very interested in small class sizes and individualized attention. Parents value honor system and character development focus. -BJ', date: '2026-02-01' }
        ],
        athleticsNotes: [
          { text: 'Plays travel baseball - primarily pitcher and first base. Also swims competitively with local club team. Strong athlete for age group. -JM', date: '2026-02-01' }
        ],
        athleticsContact: 'Coach Martinez',
        familyConnections: ''
      },
      {
        id: 7,
        name: 'Ethan Zhang',
        grade: '6',
        parentNames: 'Wei and Lin Zhang',
        sports: ['Basketball', 'Tennis'],
        currentSchool: 'Ocean View Elementary',
        statuses: ['Applicant'],
        admissionsNotes: [
          { text: 'Family relocating from California. Looking for strong academics and athletics. Student has been in gifted program at current school. -BJ', date: '2026-02-06' }
        ],
        athleticsNotes: [
          { text: 'Good height for age. Plays point guard in youth basketball. Also competitive junior tennis player. -JM', date: '2026-02-06' }
        ],
        athleticsContact: 'Coach Martinez',
        familyConnections: ''
      },
      
      // 7th Grade (3 students)
      {
        id: 8,
        name: 'Noah Bennett',
        grade: '7',
        parentNames: 'Michael and Sarah Bennett',
        sports: ['Football', 'Wrestling'],
        currentSchool: 'Bayside Middle',
        statuses: ['Applicant', 'Admissions Event'],
        admissionsNotes: [
          { text: 'Attended open house with parents. Strong interest in both academics and athletics. Currently honor roll student. -BJ', date: '2026-02-08' }
        ],
        athleticsNotes: [
          { text: 'Plays linebacker in youth football. Also wrestles - placed 3rd in regional tournament. Dedicated and hardworking athlete. -KD', date: '2026-02-08' }
        ],
        athleticsContact: 'Coach Davis',
        familyConnections: ''
      },
      {
        id: 9,
        name: 'Sophia Patel',
        grade: '7',
        parentNames: 'Raj and Priya Patel',
        sports: ['Swimming', 'Volleyball'],
        currentSchool: 'Norfolk Christian',
        statuses: ['Applicant'],
        admissionsNotes: [
          { text: 'Transfer inquiry from another independent school. Family seeking stronger swim program. Excellent academic record. -BJ', date: '2026-02-05' }
        ],
        athleticsNotes: [
          { text: 'Year-round competitive swimmer with USA Swimming. Also plays volleyball. Strong work ethic in pool. -SW', date: '2026-02-05' }
        ],
        athleticsContact: 'Coach Williams',
        familyConnections: ''
      },
      {
        id: 5,
        name: 'Olivia Thompson',
        grade: '7',
        parentNames: 'Christopher and Amanda Thompson',
        sports: ['Field Hockey', 'Lacrosse'],
        currentSchool: 'Tidewater Academy',
        statuses: ['Applicant'],
        admissionsNotes: [
          { text: 'Currently at another independent school. Family seeking stronger athletics program while maintaining academic rigor. Application in progress. -BJ', date: '2026-01-30' },
          { text: 'Campus tour completed. Student and parents very positive about visit. Liked small school feel and sense of community. -BJ', date: '2026-01-15' }
        ],
        athleticsNotes: [
          { text: 'Experienced field hockey and lacrosse player. Currently plays for club teams in both sports. Good stick skills and field awareness. Would fit well into program. -KD', date: '2026-01-30' }
        ],
        athleticsContact: 'Coach Davis',
        familyConnections: 'Father is NA alumnus - Class of 1989'
      },
      
      // 8th Grade (3 students)
      {
        id: 10,
        name: 'Ava Harris',
        grade: '8',
        parentNames: 'James and Lisa Harris',
        sports: ['Cheering', 'Track & Field'],
        currentSchool: 'Tallwood Middle',
        statuses: ['Applicant'],
        admissionsNotes: [
          { text: 'Inquired about cheerleading program and track opportunities. Strong academic performance. Shadow day scheduled. -BJ', date: '2026-02-07' }
        ],
        athleticsNotes: [
          { text: 'Competitive cheerleader with tumbling skills. Also runs sprints in track. High energy and positive attitude. -TA', date: '2026-02-07' }
        ],
        athleticsContact: 'Coach Anderson',
        familyConnections: ''
      },
      {
        id: 2,
        name: 'Marcus Johnson',
        grade: '8',
        parentNames: 'Robert and Angela Johnson',
        sports: ['Football', 'Lacrosse'],
        currentSchool: 'Great Neck Middle',
        statuses: ['Applicant'],
        admissionsNotes: [
          { text: 'Strong academic record - 3.8 GPA. Interested in honors program. Shadow day scheduled for Feb 15th. -BJ', date: '2026-02-05' }
        ],
        athleticsNotes: [
          { text: 'Multi-sport athlete. Plays quarterback in youth football and midfielder in lacrosse. Good size and speed for grade level. Leadership qualities evident. -TA', date: '2026-02-05' },
          { text: 'Film review shows strong throwing mechanics and field vision. Very coachable according to current coaches. -TA', date: '2026-01-28' }
        ],
        athleticsContact: 'Coach Anderson',
        familyConnections: 'Sibling currently enrolled - Grade 10'
      },
      {
        id: 11,
        name: 'Isabella Martinez',
        grade: '8',
        parentNames: 'Carlos and Maria Martinez',
        sports: ['Softball', 'Basketball'],
        currentSchool: 'Plaza Middle',
        statuses: ['Admissions Event'],
        admissionsNotes: [
          { text: 'Family attended admissions event. Very engaged with questions about curriculum and extracurriculars. -BJ', date: '2026-02-04' }
        ],
        athleticsNotes: [
          { text: 'Plays travel softball as catcher and third base. Good bat and strong arm. Also plays basketball. -MT', date: '2026-02-04' }
        ],
        athleticsContact: 'Coach Thompson',
        familyConnections: ''
      },
      
      // 9th Grade (3 students)
      {
        id: 12,
        name: 'Liam Brown',
        grade: '9',
        parentNames: 'David and Emily Brown',
        sports: ['Crew', 'Cross Country'],
        currentSchool: 'First Colonial High',
        statuses: ['Applicant'],
        admissionsNotes: [
          { text: 'Transfer inquiry for 10th grade. Family interested in crew program and college prep focus. -BJ', date: '2026-02-08' }
        ],
        athleticsNotes: [
          { text: 'Rows with local club. Good technique and strong erg scores. Also runs cross country. Endurance athlete. -LR', date: '2026-02-08' }
        ],
        athleticsContact: 'Coach Roberts',
        familyConnections: ''
      },
      {
        id: 15,
        name: 'Emily Chen',
        grade: '9',
        parentNames: 'David and Michelle Chen',
        sports: ['Volleyball', 'Track & Field'],
        currentSchool: 'Norfolk Collegiate',
        statuses: ['Applicant', 'Admissions Event'],
        admissionsNotes: [
          { text: 'Family attended winter open house. Parents very impressed with STEM curriculum and robotics program. Student currently in honors math and science track at current school. -BJ', date: '2026-02-08' },
          { text: 'Follow-up call with parents. Discussed financial aid options and academic scholarship opportunities. Strong interest confirmed. -BJ', date: '2026-01-22' }
        ],
        athleticsNotes: [
          { text: 'Varsity volleyball player, strong setter with excellent court awareness. Also competes in track - primarily 400m and 800m events. Club volleyball in off-season. -SW', date: '2026-02-08' },
          { text: 'Attended skills clinic. Coaches impressed with athleticism and coachability. Would be immediate contributor to both programs. -SW', date: '2026-01-25' }
        ],
        athleticsContact: 'Coach Williams',
        familyConnections: 'Alumni parent - Class of 1998'
      },
      {
        id: 6,
        name: 'Daniel Park',
        grade: '9',
        parentNames: 'John and Grace Park',
        sports: ['Tennis', 'Cross Country'],
        currentSchool: 'Princess Anne Middle',
        statuses: ['Withdrawn'],
        admissionsNotes: [
          { text: 'Family decided to remain at current school due to proximity to home. Positive interaction throughout process. -BJ', date: '2026-02-07' },
          { text: 'Initial inquiry and campus tour completed. Strong academic fit, family was very engaged. -BJ', date: '2026-01-18' }
        ],
        athleticsNotes: [
          { text: 'Competitive tennis player with regional rankings. Also runs cross country. Self-motivated athlete. -LR', date: '2026-01-18' }
        ],
        athleticsContact: 'Coach Roberts',
        familyConnections: ''
      },
      
      // 10th Grade (3 students)
      {
        id: 13,
        name: 'Jackson Lee',
        grade: '10',
        parentNames: 'Brian and Susan Lee',
        sports: ['Golf', 'Baseball'],
        currentSchool: 'Ocean Lakes High',
        statuses: ['Applicant'],
        admissionsNotes: [
          { text: 'Late transfer inquiry. Family moving to area from Richmond. Strong academics, looking for junior year entry. -BJ', date: '2026-02-09' }
        ],
        athleticsNotes: [
          { text: 'Competitive golfer with low handicap. Also plays baseball. Multi-sport athlete with good character. -MT', date: '2026-02-09' }
        ],
        athleticsContact: 'Coach Thompson',
        familyConnections: ''
      },
      {
        id: 14,
        name: 'Mia Robinson',
        grade: '10',
        parentNames: 'Steven and Karen Robinson',
        sports: ['Sailing', 'Swimming'],
        currentSchool: 'Norfolk Academy',
        statuses: ['Applicant'],
        admissionsNotes: [
          { text: 'Current 9th grader interested in continuing. Meeting scheduled to discuss academic path and athletics. -BJ', date: '2026-02-06' }
        ],
        athleticsNotes: [
          { text: 'Already on sailing team. Strong sailor with race experience. Also swims on club team. -SW', date: '2026-02-06' }
        ],
        athleticsContact: 'Coach Williams',
        familyConnections: 'Current student'
      },
      {
        id: 3,
        name: 'Sarah Williams',
        grade: '10',
        parentNames: 'Thomas and Rebecca Williams',
        sports: ['Soccer', 'Basketball'],
        currentSchool: 'Cape Henry Collegiate',
        statuses: ['Admissions Event'],
        admissionsNotes: [
          { text: 'Transfer inquiry. Family relocating to area from Charlotte, NC. Looking for strong college prep program with competitive athletics. -BJ', date: '2026-02-03' },
          { text: 'Transcript review shows excellent academic performance - honor roll all semesters. Student interested in pre-med track. -BJ', date: '2026-01-20' }
        ],
        athleticsNotes: [
          { text: 'Captain of varsity soccer team at current school. Primarily plays center mid. Also plays point guard in basketball. Excellent leadership and work ethic. -MT', date: '2026-02-03' }
        ],
        athleticsContact: 'Coach Thompson',
        familyConnections: ''
      }
    ];
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
      if (gradeDropdownRef.current && !gradeDropdownRef.current.contains(event.target)) {
        setShowGradeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.currentSchool.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.sports.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatuses.length === 0 || 
      filterStatuses.some(status => student.statuses.includes(status));
   const matchesGrade = filterGrades.length === 0 || 
  filterGrades.some(g => String(g) === String(student.grade));
    
    return matchesSearch && matchesStatus && matchesGrade;
  }).sort((a, b) => {
    // First sort by grade (6, 7, 8, 9, 10)
    const gradeA = parseInt(a.grade);
    const gradeB = parseInt(b.grade);
    if (gradeA !== gradeB) {
      return gradeA - gradeB;
    }
    
    // Then sort alphabetically by last name
    const lastNameA = a.name.split(' ').pop().toLowerCase();
    const lastNameB = b.name.split(' ').pop().toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });

const getGradeBreakdown = () => {
  const breakdown = {};
  gradeOptions.forEach(grade => {
    breakdown[grade] = students.filter(s => String(s.grade) === String(grade)).length;
  });
  return breakdown;
};

  const handleAddStudent = async (student) => {
    console.log('Adding student:', student);
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addStudent', ...student })
      });
      const result = await response.json();
      console.log('Add result:', result);
      if (result.success) {
        await loadStudents();
        setIsAddingStudent(false);
      } else {
        alert('Failed to add student: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error saving student. Please try again.');
    }
  };

  const handleUpdateStudent = async (updatedStudent) => {
    console.log('Updating student:', updatedStudent);
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStudent', ...updatedStudent })
      });
      const result = await response.json();
      console.log('Update result:', result);
      if (result.success) {
        await loadStudents();
        setEditingStudent(null);
      } else {
        alert('Failed to update student: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student. Please try again.');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${SCRIPT_URL}?action=deleteStudent&id=${id}`, {
          method: 'POST'
        });
        const result = await response.json();
        if (result.success) {
          await loadStudents();
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student. Please try again.');
      }
    }
  };

  const toggleNotes = (id) => {
    setExpandedNotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const collapseAll = () => {
    setExpandedCards({});
  };

  const toggleStatusFilter = (status) => {
    setFilterStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleGradeFilter = (grade) => {
    setFilterGrades(prev => 
      prev.includes(grade) 
        ? prev.filter(g => g !== grade)
        : [...prev, grade]
    );
  };

  const handleGradeBadgeClick = (grade) => {
    if (filterGrades.includes(grade)) {
      setFilterGrades(filterGrades.filter(g => g !== grade));
    } else {
      setFilterGrades([grade]);
    }
  };

  const exportToCSV = () => {
    const headers = ['Student Name', 'Grade Level', 'Parent Names', 'Sport(s)', 'Current School', 'Statuses', 'Admissions Notes', 'Athletics Notes', 'Athletics Contact', 'Family Connections'];
    const rows = students.map(s => [
      s.name, 
      s.grade, 
      s.parentNames, 
      s.sports.join(', '), 
      s.currentSchool, 
      s.statuses.join('; '),
      s.admissionsNotes.map(n => `${n.date}: ${n.text}`).join(' | '),
      s.athleticsNotes.map(n => `${n.date}: ${n.text}`).join(' | '),
      s.athleticsContact, 
      s.familyConnections
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `norfolk-academy-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const gradeBreakdown = getGradeBreakdown();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ 
        background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%)'
      }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ color: UVAColors.blue }}>
            Loading Norfolk Academy Admissions...
          </div>
          <div className="text-sm" style={{ color: UVAColors.darkGray }}>
            Connecting to Google Sheets
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ 
      background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* FIXED Header - stays at top */}
      <header className="sticky top-0 z-50" style={{ 
        background: `linear-gradient(135deg, ${UVAColors.blue} 0%, ${UVAColors.blueLight} 100%)`,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Title */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-semibold text-white mb-0.5">
                Norfolk Academy
              </h1>
              <p className="text-sm text-white opacity-90">
                2027-28 Admissions & Athletics Coordination
              </p>
            </div>

            {/* Center: Grade Badges */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleGradeBadgeClick('6')}
                onMouseEnter={(e) => {
                  if (!filterGrades.includes('6')) {
                    e.currentTarget.style.backgroundColor = 'rgba(248, 76, 30, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!filterGrades.includes('6')) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                className="rounded-md font-medium transition-all flex flex-col items-center justify-center"
                style={{ 
                  backgroundColor: filterGrades.includes('6') ? UVAColors.orange : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  width: '50px',
                  height: '50px'
                }}
              >
                <span className="font-bold text-xl leading-none mb-0.5">{gradeBreakdown['6']}</span>
                <span className="text-xs" style={{ opacity: 0.8 }}>6th</span>
              </button>

              <span className="text-white opacity-30 mx-0.5">|</span>

              <button
                onClick={() => handleGradeBadgeClick('7')}
                onMouseEnter={(e) => {
                  if (!filterGrades.includes('7')) {
                    e.currentTarget.style.backgroundColor = 'rgba(248, 76, 30, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!filterGrades.includes('7')) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                className="rounded-md font-medium transition-all flex flex-col items-center justify-center"
                style={{ 
                  backgroundColor: filterGrades.includes('7') ? UVAColors.orange : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  width: '50px',
                  height: '50px'
                }}
              >
                <span className="font-bold text-xl leading-none mb-0.5">{gradeBreakdown['7']}</span>
                <span className="text-xs" style={{ opacity: 0.8 }}>7th</span>
              </button>

              <button
                onClick={() => handleGradeBadgeClick('8')}
                onMouseEnter={(e) => {
                  if (!filterGrades.includes('8')) {
                    e.currentTarget.style.backgroundColor = 'rgba(248, 76, 30, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!filterGrades.includes('8')) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                className="rounded-md font-medium transition-all flex flex-col items-center justify-center"
                style={{ 
                  backgroundColor: filterGrades.includes('8') ? UVAColors.orange : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  width: '50px',
                  height: '50px'
                }}
              >
                <span className="font-bold text-xl leading-none mb-0.5">{gradeBreakdown['8']}</span>
                <span className="text-xs" style={{ opacity: 0.8 }}>8th</span>
              </button>

              <button
                onClick={() => handleGradeBadgeClick('9')}
                onMouseEnter={(e) => {
                  if (!filterGrades.includes('9')) {
                    e.currentTarget.style.backgroundColor = 'rgba(248, 76, 30, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!filterGrades.includes('9')) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                className="rounded-md font-medium transition-all flex flex-col items-center justify-center"
                style={{ 
                  backgroundColor: filterGrades.includes('9') ? UVAColors.orange : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  width: '50px',
                  height: '50px'
                }}
              >
                <span className="font-bold text-xl leading-none mb-0.5">{gradeBreakdown['9']}</span>
                <span className="text-xs" style={{ opacity: 0.8 }}>9th</span>
              </button>

              <span className="text-white opacity-30 mx-0.5">|</span>

              <button
                onClick={() => handleGradeBadgeClick('10')}
                onMouseEnter={(e) => {
                  if (!filterGrades.includes('10')) {
                    e.currentTarget.style.backgroundColor = 'rgba(248, 76, 30, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!filterGrades.includes('10')) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                className="rounded-md font-medium transition-all flex flex-col items-center justify-center"
                style={{ 
                  backgroundColor: filterGrades.includes('10') ? UVAColors.orange : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  width: '50px',
                  height: '50px'
                }}
              >
                <span className="font-bold text-xl leading-none mb-0.5">{gradeBreakdown['10']}</span>
                <span className="text-xs" style={{ opacity: 0.8 }}>10th</span>
              </button>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={loadStudents}
                className="px-3 py-2 text-xs font-medium rounded-lg transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                Refresh
              </button>
              <button
                onClick={() => setIsAddingStudent(true)}
                className="px-4 py-2 text-white text-xs font-semibold rounded-lg transition-all hover:opacity-90"
                style={{ backgroundColor: UVAColors.orange }}
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FIXED Filters - stays below header - FIXED STICKY POSITIONING */}
      <div 
        className="sticky z-40 bg-gradient-to-b from-gray-50 to-transparent pb-2"
        style={{ 
          top: '90px',
          position: 'sticky'
        }}
      >
        <div className="max-w-6xl mx-auto px-8 pt-3">
          <div className="rounded-xl p-3 shadow-lg" style={{ 
            backgroundColor: '#EDF2F7',
            border: `1px solid ${UVAColors.mediumGray}` 
          }}>
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-base"
                  style={{ 
                    border: `1px solid ${UVAColors.mediumGray}`,
                    backgroundColor: UVAColors.lightGray,
                    color: UVAColors.textGray
                  }}
                />
              </div>
              
              <div className="relative" ref={statusDropdownRef}>
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-white flex items-center gap-2"
                  style={{ border: `1px solid ${UVAColors.mediumGray}`, minWidth: '200px' }}
                >
                  <span>
                    {filterStatuses.length === 0 
                      ? 'Admissions Status' 
                      : `${filterStatuses.length} selected`}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {showStatusDropdown && (
                  <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border z-10"
                       style={{ border: `1px solid ${UVAColors.mediumGray}`, minWidth: '200px' }}>
                    {statusOptions.map(status => (
                      <label 
                        key={status}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filterStatuses.includes(status)}
                          onChange={() => toggleStatusFilter(status)}
                          className="mr-3"
                        />
                        <span className="text-sm">{status}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={gradeDropdownRef}>
                <button
                  onClick={() => setShowGradeDropdown(!showGradeDropdown)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-white flex items-center gap-2"
                  style={{ border: `1px solid ${UVAColors.mediumGray}`, minWidth: '150px' }}
                >
                  <span>
                    {filterGrades.length === 0 
                      ? 'Grade' 
                      : `${filterGrades.length} selected`}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {showGradeDropdown && (
                  <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border z-10"
                       style={{ border: `1px solid ${UVAColors.mediumGray}`, minWidth: '150px' }}>
                    {gradeOptions.map(grade => (
                      <label 
                        key={grade}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filterGrades.includes(grade)}
                          onChange={() => toggleGradeFilter(grade)}
                          className="mr-3"
                        />
                        <span className="text-sm">{gradeLabels[grade]} Grade</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => setViewMode('table')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-medium"
                  style={{ 
                    backgroundColor: viewMode === 'table' ? UVAColors.orange : 'white',
                    color: viewMode === 'table' ? 'white' : UVAColors.textGray,
                    border: `1px solid ${viewMode === 'table' ? UVAColors.orange : UVAColors.mediumGray}`
                  }}
                >
                  <LayoutGrid size={14} />
                  <span>Table</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-medium"
                  style={{ 
                    backgroundColor: viewMode === 'list' ? UVAColors.orange : 'white',
                    color: viewMode === 'list' ? 'white' : UVAColors.textGray,
                    border: `1px solid ${viewMode === 'list' ? UVAColors.orange : UVAColors.mediumGray}`
                  }}
                >
                  <List size={14} />
                  <span>List</span>
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: UVAColors.darkGray }}>
                Showing {filteredStudents.length} of {students.length} students
              </span>
              {(filterStatuses.length > 0 || filterGrades.length > 0) && (
                <>
                  <span className="text-xs" style={{ color: UVAColors.darkGray }}>•</span>
                  <button
                    onClick={() => {
                      setFilterStatuses([]);
                      setFilterGrades([]);
                    }}
                    className="text-xs font-medium hover:underline"
                    style={{ color: UVAColors.orange }}
                  >
                    Clear filters
                  </button>
                </>
              )}
              
              {/* Collapse All - appears on same row when needed */}
              {viewMode === 'table' && Object.values(expandedCards).some(val => val) && (
                <>
                  <span className="text-xs" style={{ color: UVAColors.darkGray }}>•</span>
                  <button
                    onClick={collapseAll}
                    className="text-xs font-medium hover:underline"
                    style={{ color: UVAColors.orange }}
                  >
                    Collapse all
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SCROLLABLE Student List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-4">
          {viewMode === 'table' ? (
            <TableView
              students={filteredStudents}
              onEdit={setEditingStudent}
              onDelete={handleDeleteStudent}
              expandedCards={expandedCards}
              onToggle={toggleCard}
            />
          ) : (
            <ListView
              students={filteredStudents}
              onEdit={setEditingStudent}
              onDelete={handleDeleteStudent}
            />
          )}

          {filteredStudents.length === 0 && (
            <div className="bg-white rounded-xl p-16 text-center shadow-lg" 
                 style={{ border: `1px solid ${UVAColors.mediumGray}` }}>
              <p className="text-lg mb-2" style={{ color: UVAColors.darkGray }}>
                No students found
              </p>
              <p className="text-sm" style={{ color: UVAColors.darkGray }}>
                Try clearing your filters or adjusting your search
              </p>
            </div>
          )}
        </div>
      </div>

      {(isAddingStudent || editingStudent) && (
        <StudentModal
          student={editingStudent}
          onSave={editingStudent ? handleUpdateStudent : handleAddStudent}
          onClose={() => {
            setIsAddingStudent(false);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
}

function TableView({ students, onEdit, onDelete, expandedCards, onToggle }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div>
      {/* Table */}
      <div className="space-y-2">
        {students.map((student) => {
          const isExpanded = expandedCards[student.id];
          return (
            <div 
              key={student.id} 
              className="bg-white rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md" 
              style={{ border: `1px solid ${UVAColors.mediumGray}` }}
            >
              {/* Row Header - Clickable */}
              <div 
                className="flex items-center px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onToggle(student.id)}
              >
                {/* Expand Icon */}
                <div className="mr-3 flex-shrink-0" style={{ width: '20px' }}>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      color: UVAColors.darkGray,
                      transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                      transition: 'transform 0.2s'
                    }} 
                  />
                </div>

                {/* Student Name - Tighter */}
                <div className="font-semibold text-base" style={{ color: UVAColors.blue, width: '175px', flex: '0 0 175px', marginRight: '8px' }}>
                  {student.name}
                </div>

                {/* Grade - Very Tight, Close to Name */}
                <div className="font-semibold text-base" style={{ color: UVAColors.blue, width: '35px', flex: '0 0 35px', marginRight: '12px' }}>
                  {gradeLabels[student.grade]}
                </div>

                {/* Status Badges - Stack One Per Line */}
                <div className="flex flex-col gap-1 mr-3" style={{ minWidth: '120px' }}>
                  {student.statuses.map((status, idx) => (
                    <span 
                      key={idx}
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap text-center"
                      style={{ 
                        backgroundColor: getStatusColor(status) + '15',
                        color: getStatusColor(status),
                        fontSize: '10px'
                      }}
                    >
                      {status}
                    </span>
                  ))}
                </div>

                {/* School - Wider, Larger Font */}
                <div className="text-base mr-4 font-medium" style={{ color: UVAColors.textGray, width: '190px', flex: '0 0 190px' }}>
                  {student.currentSchool}
                </div>

                {/* Sports - Wider, Larger Font */}
                <div className="text-base mr-auto font-medium" style={{ color: UVAColors.textGray, width: '200px', flex: '0 0 200px' }}>
                  {student.sports.join(', ')}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEdit(student)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:opacity-80"
                    style={{ 
                      backgroundColor: UVAColors.lightGray,
                      color: UVAColors.textGray
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(student.id)}
                    className="p-1.5 transition-all hover:opacity-60"
                    style={{ 
                      color: '#DC2626'
                    }}
                    title="Delete student"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-4 pt-2 bg-gray-50" style={{ marginLeft: '44px', borderTop: `1px solid ${UVAColors.mediumGray}` }}>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Admissions Notes */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide mb-2" 
                           style={{ color: UVAColors.orange }}>
                        Admissions Notes
                      </div>
                      <div className="space-y-2">
                        {student.admissionsNotes.map((note, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg shadow-sm" style={{ border: `1px solid ${UVAColors.mediumGray}` }}>
                            <div className="text-sm leading-relaxed" style={{ color: UVAColors.textGray }}>
                              <span className="font-medium" style={{ color: UVAColors.darkGray }}>{formatDate(note.date)}</span> — {note.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Athletics Notes */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide mb-2" 
                           style={{ color: UVAColors.blue }}>
                        Athletics Notes
                      </div>
                      <div className="space-y-2">
                        {student.athleticsNotes.map((note, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg shadow-sm" style={{ border: `1px solid ${UVAColors.mediumGray}` }}>
                            <div className="text-sm leading-relaxed" style={{ color: UVAColors.textGray }}>
                              <span className="font-medium" style={{ color: UVAColors.darkGray }}>{formatDate(note.date)}</span> — {note.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-3" style={{ borderTop: `1px solid ${UVAColors.mediumGray}` }}>
                    <div>
                      <div className="text-xs font-semibold mb-1 uppercase tracking-wide" 
                           style={{ color: UVAColors.darkGray }}>
                        Parents
                      </div>
                      <div className="text-sm font-medium" style={{ color: UVAColors.textGray }}>
                        {student.parentNames}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold mb-1 uppercase tracking-wide" 
                           style={{ color: UVAColors.darkGray }}>
                        Athletics Contact
                      </div>
                      <div className="text-sm font-medium" style={{ color: UVAColors.textGray }}>
                        {student.athleticsContact}
                      </div>
                    </div>
                  </div>

                  {student.familyConnections && (
                    <div className="mt-3 px-3 py-2 rounded-lg" 
                         style={{ backgroundColor: 'white', borderLeft: `3px solid ${UVAColors.orange}`, border: `1px solid ${UVAColors.mediumGray}` }}>
                      <div className="text-xs font-semibold mb-1 uppercase tracking-wide" 
                           style={{ color: UVAColors.darkGray }}>
                        Family Connection
                      </div>
                      <div className="text-sm font-medium" style={{ color: UVAColors.textGray }}>
                        {student.familyConnections}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudentCard({ student, onEdit, onDelete, expanded, onToggle, notesExpanded, onToggleNotes }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden transition-all shadow-lg hover:shadow-xl"
         style={{ border: `1px solid ${UVAColors.mediumGray}` }}>
      
      <div className="p-4">
        {/* Always visible header */}
        <div className="flex items-start justify-between mb-2">
          <div 
            className="flex-1 cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={onToggle}
            title={expanded ? "Click to collapse" : "Click to expand"}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: UVAColors.blue }}>
              {student.name} <span>• {gradeLabels[student.grade]}</span>
            </h3>
            
            <div className="flex items-center gap-3 text-sm mb-2" style={{ color: UVAColors.darkGray }}>
              <span>{student.currentSchool}</span>
              <span>•</span>
              <span>{student.sports.join(', ')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {student.statuses.map((status, idx) => (
                <span 
                  key={idx}
                  className="inline-block px-3 py-1 rounded-lg text-xs font-medium"
                  style={{ 
                    backgroundColor: getStatusColor(status) + '15',
                    color: getStatusColor(status)
                  }}
                >
                  {status}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all hover:opacity-80"
              style={{ 
                backgroundColor: UVAColors.lightGray,
                color: UVAColors.textGray
              }}
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="p-2 transition-all hover:opacity-60"
              style={{ 
                color: '#DC2626'
              }}
              title="Delete student"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Expandable content - only shows when expanded */}
        {expanded && (
          <>
            <div className="space-y-3 mb-4 mt-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: UVAColors.lightGray }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold uppercase tracking-wide" 
                       style={{ color: UVAColors.orange }}>
                    Admissions Notes
                  </div>
                  {student.admissionsNotes.length > 1 && (
                    <button
                      onClick={onToggleNotes}
                      className="text-xs font-medium px-3 py-1 rounded transition-all"
                      style={{ 
                        backgroundColor: 'white',
                        color: UVAColors.textGray
                      }}
                    >
                      {notesExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {(notesExpanded ? student.admissionsNotes : student.admissionsNotes.slice(0, 1)).map((note, idx) => (
                    <div key={idx} className="text-sm leading-relaxed" style={{ color: UVAColors.textGray }}>
                      <span className="font-medium" style={{ color: UVAColors.darkGray }}>{formatDate(note.date)}</span> — {note.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: UVAColors.lightGray }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold uppercase tracking-wide" 
                       style={{ color: UVAColors.blue }}>
                    Athletics Notes
                  </div>
                  {student.athleticsNotes.length > 1 && (
                    <button
                      onClick={onToggleNotes}
                      className="text-xs font-medium px-3 py-1 rounded transition-all"
                      style={{ 
                        backgroundColor: 'white',
                        color: UVAColors.textGray
                      }}
                    >
                      {notesExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {(notesExpanded ? student.athleticsNotes : student.athleticsNotes.slice(0, 1)).map((note, idx) => (
                    <div key={idx} className="text-sm leading-relaxed" style={{ color: UVAColors.textGray }}>
                      <span className="font-medium" style={{ color: UVAColors.darkGray }}>{formatDate(note.date)}</span> — {note.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3" style={{ borderTop: `1px solid ${UVAColors.mediumGray}` }}>
              <div>
                <div className="text-xs font-semibold mb-1 uppercase tracking-wide" 
                     style={{ color: UVAColors.darkGray }}>
                  Parents
                </div>
                <div className="text-sm font-medium" style={{ color: UVAColors.textGray }}>
                  {student.parentNames}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold mb-1 uppercase tracking-wide" 
                     style={{ color: UVAColors.darkGray }}>
                  Athletics Contact
                </div>
                <div className="text-sm font-medium" style={{ color: UVAColors.textGray }}>
                  {student.athleticsContact}
                </div>
              </div>
            </div>

            {student.familyConnections && (
              <div className="mt-3 px-3 py-2 rounded-lg" 
                   style={{ backgroundColor: UVAColors.lightGray, borderLeft: `3px solid ${UVAColors.orange}` }}>
                <div className="text-xs font-semibold mb-1 uppercase tracking-wide" 
                     style={{ color: UVAColors.darkGray }}>
                  Family Connection
                </div>
                <div className="text-sm font-medium" style={{ color: UVAColors.textGray }}>
                  {student.familyConnections}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ListView({ students, onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg" style={{ border: `1px solid ${UVAColors.mediumGray}` }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: UVAColors.blue }}>
              <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase" style={{ width: '200px' }}>
                Student Info
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase" style={{ minWidth: '500px' }}>
                Notes
              </th>
              <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase" style={{ width: '120px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} 
                  className="border-b hover:bg-gray-50 transition-colors"
                  style={{ 
                    borderColor: UVAColors.mediumGray,
                    borderBottomWidth: '2px'
                  }}>
                <td className="px-4 py-5 align-top">
                  <div className="space-y-1">
                    <div className="font-bold text-base" style={{ color: UVAColors.blue }}>
                      {student.name}
                    </div>
                    <div className="text-sm font-semibold" style={{ color: UVAColors.blue }}>
                      {gradeLabels[student.grade]} Grade
                    </div>
                    <div className="text-sm" style={{ color: UVAColors.textGray }}>
                      {student.currentSchool}
                    </div>
                    <div className="text-sm" style={{ color: UVAColors.textGray }}>
                      {student.sports.join(', ')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold mb-2 uppercase tracking-wide" 
                           style={{ color: UVAColors.orange }}>
                        Admissions
                      </div>
                      <div className="space-y-2">
                        {student.admissionsNotes.map((note, noteIdx) => (
                          <div key={noteIdx} className="text-sm leading-relaxed" style={{ color: UVAColors.textGray }}>
                            <span className="font-medium" style={{ color: UVAColors.darkGray }}>{formatDate(note.date)}</span> — {note.text}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold mb-2 uppercase tracking-wide" 
                           style={{ color: UVAColors.blue }}>
                        Athletics
                      </div>
                      <div className="space-y-2">
                        {student.athleticsNotes.map((note, noteIdx) => (
                          <div key={noteIdx} className="text-sm leading-relaxed" style={{ color: UVAColors.textGray }}>
                            <span className="font-medium" style={{ color: UVAColors.darkGray }}>{formatDate(note.date)}</span> — {note.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 align-top">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => onEdit(student)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:opacity-80"
                      style={{ backgroundColor: UVAColors.lightGray, color: UVAColors.textGray }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(student.id)}
                      className="p-2 transition-all hover:opacity-60 flex items-center justify-center"
                      style={{ color: '#DC2626' }}
                      title="Delete student"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentModal({ student, onSave, onClose }) {
  const [formData, setFormData] = useState(student || {
    name: '',
    grade: '9',
    parentNames: '',
    sports: [],
    currentSchool: '',
    statuses: [],
    admissionsNotes: [{ text: '', date: new Date().toISOString().split('T')[0] }],
    athleticsNotes: [{ text: '', date: new Date().toISOString().split('T')[0] }],
    athleticsContact: '',
    familyConnections: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form submitted, original formData:', formData);
    
    const cleanedData = {
      ...formData,
      admissionsNotes: formData.admissionsNotes.filter(n => n.text.trim() !== ''),
      athleticsNotes: formData.athleticsNotes.filter(n => n.text.trim() !== '')
    };
    
    // Ensure at least one empty note exists if all were filtered out (for new students)
    if (cleanedData.admissionsNotes.length === 0) {
      cleanedData.admissionsNotes = [{ text: '', date: new Date().toISOString().split('T')[0] }];
    }
    if (cleanedData.athleticsNotes.length === 0) {
      cleanedData.athleticsNotes = [{ text: '', date: new Date().toISOString().split('T')[0] }];
    }
    
    // Preserve ID if editing existing student
    if (student && student.id) {
      cleanedData.id = student.id;
    }
    
    console.log('Cleaned data being saved:', cleanedData);
    
    try {
      onSave(cleanedData);
    } catch (error) {
      console.error('Error in onSave:', error);
      alert('Error saving student: ' + error.message);
    }
  };

  const toggleSport = (sport) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const toggleStatus = (status) => {
    setFormData(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status]
    }));
  };

  const addNote = (type) => {
    const newNote = { text: '', date: new Date().toISOString().split('T')[0] };
    setFormData(prev => ({
      ...prev,
      [type]: [newNote, ...prev[type]]  // Add at beginning (top)
    }));
  };

  const updateNote = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((note, idx) => 
        idx === index ? { ...note, [field]: value } : note
      )
    }));
  };

  const removeNote = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl" style={{ maxHeight: '85vh' }}>
        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
             style={{ borderBottom: `1px solid ${UVAColors.mediumGray}` }}>
          <h2 className="text-xl font-bold" style={{ color: UVAColors.blue }}>
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg transition-all hover:bg-gray-100"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form id="studentForm" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Basic Info - Tighter spacing */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: UVAColors.textGray }}>
                    Student Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ border: `1px solid ${UVAColors.mediumGray}` }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: UVAColors.textGray }}>
                    Grade Level
                  </label>
                  <select
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white text-sm"
                    style={{ border: `1px solid ${UVAColors.mediumGray}` }}
                  >
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{gradeLabels[grade]} Grade</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: UVAColors.textGray }}>
                    Current School
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currentSchool}
                    onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ border: `1px solid ${UVAColors.mediumGray}` }}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: UVAColors.textGray }}>
                    Parent Names
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentNames}
                    onChange={(e) => setFormData({ ...formData, parentNames: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ border: `1px solid ${UVAColors.mediumGray}` }}
                    placeholder="e.g., John and Jane Doe"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: UVAColors.textGray }}>
                  Status (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => toggleStatus(status)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        backgroundColor: formData.statuses.includes(status) ? getStatusColor(status) : UVAColors.lightGray,
                        color: formData.statuses.includes(status) ? 'white' : UVAColors.textGray
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sports */}
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: UVAColors.textGray }}>
                  Sports of Interest
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {sportsList.map(sport => (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => toggleSport(sport)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        backgroundColor: formData.sports.includes(sport) ? UVAColors.darkGray : UVAColors.lightGray,
                        color: formData.sports.includes(sport) ? 'white' : UVAColors.textGray
                      }}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: UVAColors.textGray }}>
                    Athletics Contact
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.athleticsContact}
                    onChange={(e) => setFormData({ ...formData, athleticsContact: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ border: `1px solid ${UVAColors.mediumGray}` }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: UVAColors.textGray }}>
                    Family Connections
                  </label>
                  <input
                    type="text"
                    value={formData.familyConnections}
                    onChange={(e) => setFormData({ ...formData, familyConnections: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ border: `1px solid ${UVAColors.mediumGray}` }}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Admissions Notes with hint */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addNote('admissionsNotes')}
                      className="px-2 py-1 text-xs font-medium rounded-lg transition-all hover:opacity-80"
                      style={{ backgroundColor: UVAColors.orange, color: 'white' }}
                    >
                      Add Note
                    </button>
                    <label className="text-xs font-semibold" style={{ color: UVAColors.textGray }}>
                      Admissions Notes
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  {formData.admissionsNotes.map((note, idx) => (
                    <div key={idx} className="p-2 rounded-lg" style={{ backgroundColor: UVAColors.lightGray }}>
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="date"
                          value={note.date}
                          onChange={(e) => updateNote('admissionsNotes', idx, 'date', e.target.value)}
                          className="px-2 py-1 rounded text-xs"
                          style={{ border: `1px solid ${UVAColors.mediumGray}` }}
                        />
                        {formData.admissionsNotes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeNote('admissionsNotes', idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={note.text}
                        onChange={(e) => updateNote('admissionsNotes', idx, 'text', e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1.5 rounded-lg resize-none text-sm"
                        style={{ border: `1px solid ${UVAColors.mediumGray}` }}
                        placeholder="Please put your initials at the end of the note."
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Athletics Notes with hint */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addNote('athleticsNotes')}
                      className="px-2 py-1 text-xs font-medium rounded-lg transition-all hover:opacity-80"
                      style={{ backgroundColor: UVAColors.blue, color: 'white' }}
                    >
                      Add Note
                    </button>
                    <label className="text-xs font-semibold" style={{ color: UVAColors.textGray }}>
                      Athletics Notes
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  {formData.athleticsNotes.map((note, idx) => (
                    <div key={idx} className="p-2 rounded-lg" style={{ backgroundColor: UVAColors.lightGray }}>
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="date"
                          value={note.date}
                          onChange={(e) => updateNote('athleticsNotes', idx, 'date', e.target.value)}
                          className="px-2 py-1 rounded text-xs"
                          style={{ border: `1px solid ${UVAColors.mediumGray}` }}
                        />
                        {formData.athleticsNotes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeNote('athleticsNotes', idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={note.text}
                        onChange={(e) => updateNote('athleticsNotes', idx, 'text', e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1.5 rounded-lg resize-none text-sm"
                        style={{ border: `1px solid ${UVAColors.mediumGray}` }}
                        placeholder="Please put your initials at the end of the note."
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-3 bg-white flex-shrink-0" style={{ borderTop: `1px solid ${UVAColors.mediumGray}` }}>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-80"
              style={{ 
                backgroundColor: UVAColors.lightGray,
                color: UVAColors.textGray
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="studentForm"
              className="flex-1 px-4 py-2 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: UVAColors.blue }}
            >
              {student ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
