import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircleIcon from '@mui/icons-material/Circle'

export default function StatusSelector({ taskState, props }) {
  const { task, updateTask } = taskState

  const handleStatusChange = (event) => {
    updateTask('status', event.target.value)
  }

  const statusIcon = () => {
    return (
      <CircleIcon
        color={task.status === 0 ? 'red' : 'green'}
        sx={{ fontSize: '12px' }}
      />
    )
  }

  return (
    <FormControl>
      <Select
        MenuProps={{
          PaperProps: {
            sx: {
              boxShadow:
                '0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.03),0px 3px 14px 2px rgba(0, 0, 0, 0.05)',
              px: '4px',
              margin: '8px 0',
              '& .MuiMenu-list': {
                py: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.6
              },
              '& .MuiMenuItem-root': {
                borderRadius: '4px',
                justifyContent: 'center',
                '&:hover': {
                  backgroundColor: '#f2f6ff'
                }
              },
              '& .MuiMenuItem-root.Mui-selected': {
                fontWeight: 600,
                minWidth: '87px',
                ':hover': {
                  backgroundColor: '#d9e5ff'
                }
              }
            }
          }
        }}
        sx={{
          ...props,
          '& .MuiBackdrop-root-MuiModal-backdrop': {
            zIndex: '1500 !important'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiOutlinedInput-input': {
            padding: '14px 8px 12px 8px !important'
          },
          flexDirection: 'row-reverse',
          height: '40px',
          paddingLeft: '8px',
          minWidth: '100px',
          fontWeight: 400,
          cursor: 'pointer',
          border: '1px solid',
          borderColor: '#d6d6d8',
          '&:hover': {
            borderColor: 'primary.dark',
          }
        }}
        IconComponent={statusIcon}
        value={task.status}
        onChange={handleStatusChange}
      >
        {['Not Completed', 'Completed'].map((value, index) => (
          <MenuItem
            key={index}
            value={index}
          >
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}