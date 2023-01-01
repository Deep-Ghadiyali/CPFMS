using CPFMS.Application.Entities.Base;

namespace CPFMS.Application.Entities.Master
{
	public class CowCast : IdNameBaseEntity
	{
	}

	public class District : IdNameBaseEntity
	{ 
	}

	public class Taluka : IdNameBaseEntity
	{
		public District District { get; set; }
	}

	public class Village : IdNameBaseEntity
	{
		public Taluka Taluka { get; set; }
	}

	public class Organization : IdNameBaseEntity
	{
	}
}
