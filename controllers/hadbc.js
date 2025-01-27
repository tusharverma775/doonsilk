const get_tender = async (req, res) => {
    try {
      const announcements = await db.tender.findAll({
        where: {
          is_active: true,
        },
      });
      res.status(200).json({ data: announcements });
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ message: 'Error fetching announcements.' });
    }
  }
  
  const get_All_tender = async (req, res) => {
    try {
      const { id } = req.body;
      const tender = await db.tender.findByPk(id);
      
      if (!tender) {
        return res.status(404).json({ message: 'Announcement not found.' });
      }
  
      res.status(200).json({ data: tender });
    } catch (error) {
      console.error('Error fetching tender:', error);
      res.status(500).json({ message: 'Error fetching tender.' });
    }
  };
  
  const update_tender = async (req, res) => {
    try {
      const { id } = req.body;
      const { value, input,is_active } = req.body;
  
      const updatedAnnouncement = await db.tender.update(
        {
          value,
          input,
          is_active
        },
        {
          where: {
            id: id,
          },
        }
      );
  
      if (!updatedAnnouncement[0]) {
        return res.status(404).json({ message: 'Announcement not found.' });
      }
  
      res.status(200).json({ message: 'Announcement updated successfully.' });
    } catch (error) {
      console.error('Error updating tender:', error);
      res.status(500).json({ message: 'Error updating tender.' });
    }
  };
  
  const delete_tender = async (req, res) => {
    try {
      const { id } = req.body;
  
      const deletedAnnouncement = await db.tender.destroy({
        where: {
          id: id,
        },
      });
  
      if (!deletedAnnouncement) {
        return res.status(404).json({ message: 'Announcement not found.' });
      }
  
      res.status(200).json({ message: 'Announcement deleted successfully.' });
    } catch (error) {
      console.error('Error deleting tender:', error);
      res.status(500).json({ message: 'Error deleting tender.' });
    }
  };