using CPFMS.Core.Entities.Base;

namespace CPFMS.Core.Entities.Master
{
	public class ResourcePerson : IdNameBaseEntity
	{
		public string Address { get; set; }
		public string Contact { get; set; }
		public string Remark { get; set; }
		public int VillageId { get; set; }
	}
}
