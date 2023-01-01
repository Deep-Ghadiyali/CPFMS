using CPFMS.Core.Entities.Base;

namespace CPFMS.Core.Entities.Master
{
	public class Account : IdNameBaseEntity
	{
		public string Type { get; set; }
		public bool isSociety { get; set; }
		public int VillageId { get; set; }
	}
}
