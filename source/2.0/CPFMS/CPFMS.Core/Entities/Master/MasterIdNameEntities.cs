using CPFMS.Core.Entities.Base;

namespace CPFMS.Core.Entities.Master
{
	public class CowCast : IdNameBaseEntity
	{
	}

	public class District : IdNameBaseEntity
	{ 
	}

	public class Taluka : IdNameBaseEntity
	{
		public int DistrictId { get; set; }
	}

	public class Village : IdNameBaseEntity
	{
		public int TalukaId { get; set; }
	}

	public class Organization : IdNameBaseEntity
	{
	}
}
